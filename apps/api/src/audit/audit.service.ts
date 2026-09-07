import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateAuditLogParams {
  organizationId?: string;
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  previousState?: any;
  newState?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(params: CreateAuditLogParams) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          organizationId: params.organizationId || null,
          userId: params.userId || null,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId || null,
          previousState: params.previousState ? JSON.parse(JSON.stringify(params.previousState)) : undefined,
          newState: params.newState ? JSON.parse(JSON.stringify(params.newState)) : undefined,
          ipAddress: params.ipAddress || null,
          userAgent: params.userAgent || null,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to record audit log: ${error.message}`, error.stack);
    }
  }

  async getOrganizationLogs(organizationId: string, limit = 50, offset = 0) {
    return this.prisma.auditLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}
