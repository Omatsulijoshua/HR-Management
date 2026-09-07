import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCareerPathDto, UpdateCareerPathDto } from './dto/career.dto';

@Injectable()
export class CareerService {
  constructor(private readonly prisma: PrismaService) {}

  async createCareerPath(tenantId: string, dto: CreateCareerPathDto) {
    const existing = await this.prisma.careerPath.findUnique({
      where: {
        organizationId_code: {
          organizationId: tenantId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Career path with code '${dto.code}' already exists`);
    }

    return this.prisma.careerPath.create({
      data: {
        organizationId: tenantId,
        title: dto.title,
        code: dto.code,
        departmentId: dto.departmentId,
        description: dto.description,
        levelSequence: dto.levelSequence ?? [],
      },
      include: {
        department: true,
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.careerPath.findMany({
      where: { organizationId: tenantId },
      include: {
        department: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const path = await this.prisma.careerPath.findFirst({
      where: { id, organizationId: tenantId },
      include: {
        department: true,
      },
    });

    if (!path) {
      throw new NotFoundException(`Career path with ID ${id} not found`);
    }

    return path;
  }

  async update(tenantId: string, id: string, dto: UpdateCareerPathDto) {
    await this.findOne(tenantId, id);

    return this.prisma.careerPath.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.levelSequence && { levelSequence: dto.levelSequence }),
      },
      include: {
        department: true,
      },
    });
  }
}
