import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnonymousFeedbackDto, UpdateFeedbackStatusDto } from './dto/feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async submitFeedback(tenantId: string, dto: CreateAnonymousFeedbackDto) {
    return this.prisma.anonymousFeedback.create({
      data: {
        organizationId: tenantId,
        category: dto.category ?? 'General Suggestion',
        message: dto.message,
        status: 'PENDING',
      },
    });
  }

  async findAllFeedback(tenantId: string) {
    return this.prisma.anonymousFeedback.findMany({
      where: { organizationId: tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneFeedback(tenantId: string, id: string) {
    const item = await this.prisma.anonymousFeedback.findFirst({
      where: { id, organizationId: tenantId },
    });

    if (!item) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return item;
  }

  async updateStatus(tenantId: string, id: string, dto: UpdateFeedbackStatusDto) {
    await this.findOneFeedback(tenantId, id);

    return this.prisma.anonymousFeedback.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.responseNote && { responseNote: dto.responseNote }),
      },
    });
  }
}
