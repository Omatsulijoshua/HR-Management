import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMobilityRequestDto, UpdateMobilityStatusDto } from './dto/mobility.dto';

@Injectable()
export class MobilityService {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(tenantId: string, dto: CreateMobilityRequestDto) {
    return this.prisma.internalMobilityRequest.create({
      data: {
        organizationId: tenantId,
        employeeId: dto.employeeId,
        targetPositionId: dto.targetPositionId,
        reason: dto.reason,
        status: 'SUBMITTED',
      },
      include: {
        employee: true,
        targetPosition: true,
      },
    });
  }

  async findAllRequests(tenantId: string) {
    return this.prisma.internalMobilityRequest.findMany({
      where: { organizationId: tenantId },
      include: {
        employee: true,
        targetPosition: true,
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async findOneRequest(tenantId: string, id: string) {
    const request = await this.prisma.internalMobilityRequest.findFirst({
      where: { id, organizationId: tenantId },
      include: {
        employee: true,
        targetPosition: true,
      },
    });

    if (!request) {
      throw new NotFoundException(`Mobility request with ID ${id} not found`);
    }

    return request;
  }

  async updateStatus(tenantId: string, id: string, dto: UpdateMobilityStatusDto) {
    await this.findOneRequest(tenantId, id);

    return this.prisma.internalMobilityRequest.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.managerReview && { managerReview: dto.managerReview }),
        ...(dto.hrReview && { hrReview: dto.hrReview }),
      },
      include: {
        employee: true,
        targetPosition: true,
      },
    });
  }
}
