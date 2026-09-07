import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit.service';
import {
  CreateOnboardingTemplateDto,
  AssignOnboardingDto,
  UpdateTaskStatusDto,
} from './dto/onboarding.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // Templates & Default Checklists
  async getTemplates(organizationId: string) {
    return this.prisma.onboardingTemplate.findMany({
      where: { organizationId },
      include: { tasks: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTemplate(organizationId: string, dto: CreateOnboardingTemplateDto) {
    return this.prisma.onboardingTemplate.create({
      data: {
        organizationId,
        title: dto.title,
        description: dto.description || null,
        tasks: dto.tasks
          ? {
              create: dto.tasks.map((t) => ({
                title: t.title,
                description: t.description || null,
                isRequired: t.isRequired ?? true,
                dueDays: t.dueDays || 7,
              })),
            }
          : undefined,
      },
      include: { tasks: true },
    });
  }

  // Active Onboarding Processes
  async getProcesses(organizationId: string) {
    return this.prisma.employeeOnboardingProcess.findMany({
      where: { organizationId },
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, employeeCode: true, department: true },
        },
        template: { select: { title: true } },
        tasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assignOnboarding(organizationId: string, dto: AssignOnboardingDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: dto.employeeId, organizationId },
    });
    if (!employee) throw new ForbiddenException('Employee not found or cross-tenant access denied');

    const template = await this.prisma.onboardingTemplate.findFirst({
      where: { id: dto.templateId, organizationId },
      include: { tasks: true },
    });
    if (!template) throw new NotFoundException('Onboarding template not found');

    const process = await this.prisma.employeeOnboardingProcess.create({
      data: {
        organizationId,
        employeeId: dto.employeeId,
        templateId: dto.templateId,
        progressPercentage: 0,
        isCompleted: false,
        tasks: {
          create: template.tasks.map((t) => ({
            title: t.title,
            description: t.description,
            isRequired: t.isRequired,
            status: TaskStatus.PENDING,
          })),
        },
      },
      include: { tasks: true },
    });

    await this.auditLogService.log({
      organizationId,
      action: 'ONBOARDING_ASSIGNED',
      entity: 'EmployeeOnboardingProcess',
      entityId: process.id,
    });

    return process;
  }

  async updateTaskStatus(organizationId: string, taskId: string, dto: UpdateTaskStatusDto) {
    const task = await this.prisma.employeeOnboardingTask.findUnique({
      where: { id: taskId },
      include: { process: true },
    });

    if (!task || task.process.organizationId !== organizationId) {
      throw new ForbiddenException('Task not found or cross-tenant access denied');
    }

    const updatedTask = await this.prisma.employeeOnboardingTask.update({
      where: { id: taskId },
      data: {
        status: dto.status,
        completedAt: dto.status === TaskStatus.COMPLETED ? new Date() : null,
      },
    });

    // Recalculate process progress percentage
    const allTasks = await this.prisma.employeeOnboardingTask.findMany({
      where: { processId: task.processId },
    });

    const completedCount = allTasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const progressPercentage = Math.round((completedCount / allTasks.length) * 100);
    const isCompleted = progressPercentage === 100;

    await this.prisma.employeeOnboardingProcess.update({
      where: { id: task.processId },
      data: {
        progressPercentage,
        isCompleted,
      },
    });

    return updatedTask;
  }
}
