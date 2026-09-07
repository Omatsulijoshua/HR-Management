import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto, AssignAssetDto, CreateAssetRequestDto, UpdateAssetRequestStatusDto } from './dto/assets.dto';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAsset(tenantId: string, dto: CreateAssetDto) {
    const existing = await this.prisma.companyAsset.findUnique({
      where: {
        organizationId_assetTag: {
          organizationId: tenantId,
          assetTag: dto.assetTag,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Asset with tag '${dto.assetTag}' already exists`);
    }

    return this.prisma.companyAsset.create({
      data: {
        organizationId: tenantId,
        name: dto.name,
        assetTag: dto.assetTag,
        serialNumber: dto.serialNumber,
        category: dto.category ?? 'LAPTOP',
        condition: dto.condition ?? 'GOOD',
        purchaseCost: dto.purchaseCost ?? 0,
        status: 'AVAILABLE',
      },
    });
  }

  async assignAsset(tenantId: string, dto: AssignAssetDto) {
    const asset = await this.prisma.companyAsset.findFirst({
      where: { id: dto.assetId, organizationId: tenantId },
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${dto.assetId} not found`);
    }

    const updated = await this.prisma.companyAsset.update({
      where: { id: dto.assetId },
      data: {
        assignedToId: dto.employeeId,
        assignedDate: new Date(),
        status: 'ASSIGNED',
      },
      include: { assignedTo: true },
    });

    await this.prisma.assetAssignmentHistory.create({
      data: {
        assetId: dto.assetId,
        employeeId: dto.employeeId,
        assignedDate: new Date(),
      },
    });

    return updated;
  }

  async createRequest(tenantId: string, employeeId: string, dto: CreateAssetRequestDto) {
    return this.prisma.assetRequest.create({
      data: {
        organizationId: tenantId,
        requestedById: employeeId,
        category: dto.category,
        reason: dto.reason,
        status: 'PENDING',
      },
      include: { requestedBy: true },
    });
  }

  async findAllAssets(tenantId: string) {
    return this.prisma.companyAsset.findMany({
      where: { organizationId: tenantId },
      include: {
        assignedTo: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllRequests(tenantId: string) {
    return this.prisma.assetRequest.findMany({
      where: { organizationId: tenantId },
      include: {
        requestedBy: true,
        fulfilledAsset: true,
      },
      orderBy: { requestedAt: 'desc' },
    });
  }
}
