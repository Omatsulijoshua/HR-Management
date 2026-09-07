import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePolicyDto, AcknowledgePolicyDto, ReportIncidentDto, UpdateIncidentStatusDto } from './dto/compliance.dto';

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  async createPolicy(tenantId: string, dto: CreatePolicyDto) {
    const existing = await this.prisma.companyPolicy.findUnique({
      where: {
        organizationId_code: {
          organizationId: tenantId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Policy with code '${dto.code}' already exists`);
    }

    return this.prisma.companyPolicy.create({
      data: {
        organizationId: tenantId,
        title: dto.title,
        code: dto.code,
        category: dto.category ?? 'GENERAL',
        documentUrl: dto.documentUrl,
        version: dto.version ?? '1.0',
        isMandatory: dto.isMandatory ?? true,
      },
    });
  }

  async acknowledgePolicy(tenantId: string, employeeId: string, dto: AcknowledgePolicyDto) {
    const policy = await this.prisma.companyPolicy.findFirst({
      where: { id: dto.policyId, organizationId: tenantId },
    });

    if (!policy) {
      throw new NotFoundException(`Policy with ID ${dto.policyId} not found`);
    }

    return this.prisma.policyAcknowledgment.upsert({
      where: {
        policyId_employeeId: {
          policyId: dto.policyId,
          employeeId,
        },
      },
      update: {
        acknowledgedAt: new Date(),
        signatureUrl: dto.signatureUrl,
      },
      create: {
        policyId: dto.policyId,
        employeeId,
        signatureUrl: dto.signatureUrl,
      },
    });
  }

  async reportIncident(tenantId: string, employeeId: string, dto: ReportIncidentDto) {
    const incidentCount = await this.prisma.hseIncident.count({
      where: { organizationId: tenantId },
    });
    const incidentNumber = `HSE-${String(incidentCount + 1).padStart(5, '0')}`;

    return this.prisma.hseIncident.create({
      data: {
        organizationId: tenantId,
        incidentNumber,
        reportedById: employeeId,
        title: dto.title,
        location: dto.location,
        severity: dto.severity ?? 'MINOR',
        status: 'REPORTED',
        description: dto.description,
      },
      include: { reportedBy: true },
    });
  }

  async findAllPolicies(tenantId: string) {
    return this.prisma.companyPolicy.findMany({
      where: { organizationId: tenantId },
      include: {
        _count: {
          select: { acknowledgments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllIncidents(tenantId: string) {
    return this.prisma.hseIncident.findMany({
      where: { organizationId: tenantId },
      include: { reportedBy: true },
      orderBy: { reportedAt: 'desc' },
    });
  }

  async updateIncidentStatus(tenantId: string, id: string, dto: UpdateIncidentStatusDto) {
    const incident = await this.prisma.hseIncident.findFirst({
      where: { id, organizationId: tenantId },
    });

    if (!incident) {
      throw new NotFoundException(`HSE incident with ID ${id} not found`);
    }

    return this.prisma.hseIncident.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.status === 'RESOLVED' || dto.status === 'CLOSED' ? { resolvedAt: new Date() } : {}),
      },
      include: { reportedBy: true },
    });
  }
}
