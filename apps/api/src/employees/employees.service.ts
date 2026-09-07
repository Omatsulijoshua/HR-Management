import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  UpdateEmployeeStatusDto,
  CreateEmergencyContactDto,
  UploadEmployeeDocumentDto,
  QueryEmployeesDto,
} from './dto/employee.dto';
import { EmployeeStatus } from '@prisma/client';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async createEmployee(organizationId: string, dto: CreateEmployeeDto, currentUserId?: string) {
    const existingCode = await this.prisma.employee.findUnique({
      where: { organizationId_employeeCode: { organizationId, employeeCode: dto.employeeCode } },
    });
    if (existingCode) throw new ConflictException('Employee code already exists in this organization');

    const existingEmail = await this.prisma.employee.findUnique({
      where: { organizationId_email: { organizationId, email: dto.email.toLowerCase() } },
    });
    if (existingEmail) throw new ConflictException('Employee email already registered');

    const result = await this.prisma.$transaction(async (tx) => {
      const employee = await tx.employee.create({
        data: {
          organizationId,
          employeeCode: dto.employeeCode,
          firstName: dto.firstName,
          lastName: dto.lastName,
          middleName: dto.middleName,
          email: dto.email.toLowerCase(),
          phone: dto.phone,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
          gender: dto.gender,
          maritalStatus: dto.maritalStatus,
          nationalId: dto.nationalId,
          address: dto.address,
          branchId: dto.branchId,
          departmentId: dto.departmentId,
          teamId: dto.teamId,
          positionId: dto.positionId,
          jobGradeId: dto.jobGradeId,
          employmentTypeId: dto.employmentTypeId,
          managerId: dto.managerId,
          hireDate: new Date(dto.hireDate),
          status: dto.status || EmployeeStatus.PROBATION,
          basicSalary: dto.basicSalary || 0,
          bankName: dto.bankName,
          accountNumber: dto.accountNumber,
        },
      });

      await tx.employeeHistory.create({
        data: {
          organizationId,
          employeeId: employee.id,
          eventType: 'HIRE',
          description: `Employee onboarded with code ${employee.employeeCode}`,
          effectiveDate: new Date(dto.hireDate),
          createdByUserId: currentUserId,
        },
      });

      return employee;
    });

    await this.auditLogService.log({
      organizationId,
      userId: currentUserId,
      action: 'EMPLOYEE_CREATED',
      entity: 'Employee',
      entityId: result.id,
    });

    return result;
  }

  async getEmployees(organizationId: string, query: QueryEmployeesDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = { organizationId };

    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.branchId) where.branchId = query.branchId;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { employeeCode: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          department: { select: { name: true, code: true } },
          branch: { select: { name: true, code: true } },
          position: { select: { title: true, code: true } },
          jobGrade: { select: { name: true, level: true } },
        },
      }),
      this.prisma.employee.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEmployeeById(organizationId: string, employeeId: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, organizationId },
      include: {
        department: true,
        branch: true,
        team: true,
        position: true,
        jobGrade: true,
        employmentType: true,
        workSchedule: true,
        manager: {
          select: { id: true, firstName: true, lastName: true, employeeCode: true, email: true },
        },
        emergencyContacts: true,
        documents: true,
        histories: { orderBy: { createdAt: 'desc' } },
        statusHistories: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!employee) {
      throw new ForbiddenException('Employee not found or cross-tenant access denied');
    }

    return employee;
  }

  async updateEmployee(
    organizationId: string,
    employeeId: string,
    dto: UpdateEmployeeDto,
    currentUserId?: string,
  ) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, organizationId },
    });
    if (!employee) throw new ForbiddenException('Employee not found or cross-tenant access denied');

    const updated = await this.prisma.employee.update({
      where: { id: employeeId },
      data: dto,
    });

    await this.prisma.employeeHistory.create({
      data: {
        organizationId,
        employeeId,
        eventType: 'PROFILE_UPDATE',
        description: 'Employee profile information updated',
        previousData: JSON.parse(JSON.stringify(employee)),
        newData: JSON.parse(JSON.stringify(updated)),
        createdByUserId: currentUserId,
      },
    });

    return updated;
  }

  async updateStatus(
    organizationId: string,
    employeeId: string,
    dto: UpdateEmployeeStatusDto,
    currentUserId?: string,
  ) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, organizationId },
    });
    if (!employee) throw new ForbiddenException('Employee not found or cross-tenant access denied');

    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.employee.update({
        where: { id: employeeId },
        data: {
          status: dto.status,
          ...(dto.status === EmployeeStatus.ACTIVE && !employee.confirmationDate
            ? { confirmationDate: new Date() }
            : {}),
        },
      });

      await tx.employeeStatusHistory.create({
        data: {
          organizationId,
          employeeId,
          previousStatus: employee.status,
          newStatus: dto.status,
          reason: dto.reason || null,
        },
      });

      await tx.employeeHistory.create({
        data: {
          organizationId,
          employeeId,
          eventType: 'STATUS_CHANGE',
          description: `Status changed from ${employee.status} to ${dto.status}. Rationale: ${dto.reason || 'N/A'}`,
          createdByUserId: currentUserId,
        },
      });

      return updated;
    });

    return result;
  }

  async addEmergencyContact(organizationId: string, employeeId: string, dto: CreateEmergencyContactDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, organizationId },
    });
    if (!employee) throw new ForbiddenException('Employee not found or cross-tenant access denied');

    return this.prisma.emergencyContact.create({
      data: { ...dto, employeeId },
    });
  }

  async deleteEmergencyContact(organizationId: string, employeeId: string, contactId: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, organizationId },
    });
    if (!employee) throw new ForbiddenException('Employee not found or cross-tenant access denied');

    return this.prisma.emergencyContact.delete({
      where: { id: contactId },
    });
  }

  async addDocument(organizationId: string, employeeId: string, dto: UploadEmployeeDocumentDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, organizationId },
    });
    if (!employee) throw new ForbiddenException('Employee not found or cross-tenant access denied');

    return this.prisma.employeeDocument.create({
      data: {
        organizationId,
        employeeId,
        title: dto.title,
        category: dto.category,
        fileUrl: dto.fileUrl,
      },
    });
  }

  async getTimeline(organizationId: string, employeeId: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: employeeId, organizationId },
    });
    if (!employee) throw new ForbiddenException('Employee not found or cross-tenant access denied');

    return this.prisma.employeeHistory.findMany({
      where: { organizationId, employeeId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
