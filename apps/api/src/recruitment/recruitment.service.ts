import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit.service';
import {
  CreateJobPostingDto,
  CreateCandidateDto,
  ApplyJobDto,
  UpdateStageDto,
  ScheduleInterviewDto,
  CreateJobOfferDto,
  ConvertCandidateDto,
} from './dto/recruitment.dto';
import { ApplicationStage, OfferStatus, EmployeeStatus } from '@prisma/client';

@Injectable()
export class RecruitmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // Job Requisitions
  async getJobs(organizationId: string) {
    return this.prisma.jobPosting.findMany({
      where: { organizationId },
      include: {
        department: { select: { name: true } },
        location: { select: { name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createJob(organizationId: string, dto: CreateJobPostingDto) {
    const existing = await this.prisma.jobPosting.findUnique({
      where: { organizationId_code: { organizationId, code: dto.code } },
    });
    if (existing) throw new ConflictException('Job code already exists');

    return this.prisma.jobPosting.create({
      data: { ...dto, organizationId },
    });
  }

  // Candidates
  async getCandidates(organizationId: string) {
    return this.prisma.candidate.findMany({
      where: { organizationId },
      include: {
        applications: {
          include: { jobPosting: { select: { title: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCandidate(organizationId: string, dto: CreateCandidateDto) {
    const existing = await this.prisma.candidate.findUnique({
      where: { organizationId_email: { organizationId, email: dto.email.toLowerCase() } },
    });
    if (existing) throw new ConflictException('Candidate with this email already exists');

    return this.prisma.candidate.create({
      data: {
        ...dto,
        email: dto.email.toLowerCase(),
        organizationId,
      },
    });
  }

  // Applications & Pipeline
  async getApplications(organizationId: string) {
    return this.prisma.jobApplication.findMany({
      where: { organizationId },
      include: {
        jobPosting: { select: { id: true, title: true, code: true } },
        candidate: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        interviews: true,
        offers: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async applyJob(organizationId: string, dto: ApplyJobDto) {
    const existing = await this.prisma.jobApplication.findUnique({
      where: {
        jobPostingId_candidateId: {
          jobPostingId: dto.jobPostingId,
          candidateId: dto.candidateId,
        },
      },
    });
    if (existing) throw new ConflictException('Candidate has already applied for this position');

    return this.prisma.jobApplication.create({
      data: {
        organizationId,
        jobPostingId: dto.jobPostingId,
        candidateId: dto.candidateId,
        stage: ApplicationStage.APPLIED,
        notes: dto.notes || null,
      },
    });
  }

  async updateApplicationStage(organizationId: string, applicationId: string, dto: UpdateStageDto) {
    const application = await this.prisma.jobApplication.findFirst({
      where: { id: applicationId, organizationId },
    });
    if (!application) throw new NotFoundException('Job application not found');

    return this.prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        stage: dto.stage,
        notes: dto.notes ? `${application.notes || ''} | Stage update: ${dto.notes}` : application.notes,
      },
    });
  }

  // Interviews & Offers
  async scheduleInterview(organizationId: string, dto: ScheduleInterviewDto) {
    return this.prisma.interview.create({
      data: {
        organizationId,
        jobApplicationId: dto.jobApplicationId,
        title: dto.title,
        scheduledAt: new Date(dto.scheduledAt),
        location: dto.location || null,
        interviewerName: dto.interviewerName || null,
      },
    });
  }

  async createOffer(organizationId: string, dto: CreateJobOfferDto) {
    return this.prisma.jobOffer.create({
      data: {
        organizationId,
        jobApplicationId: dto.jobApplicationId,
        offeredSalary: dto.offeredSalary,
        startDate: new Date(dto.startDate),
        status: OfferStatus.SENT,
      },
    });
  }

  // 1-Click Candidate to Employee Conversion
  async convertCandidateToEmployee(
    organizationId: string,
    candidateId: string,
    dto: ConvertCandidateDto,
    currentUserId?: string,
  ) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { id: candidateId, organizationId },
    });
    if (!candidate) throw new NotFoundException('Candidate not found');

    const existingEmp = await this.prisma.employee.findFirst({
      where: { organizationId, email: candidate.email },
    });
    if (existingEmp) throw new ConflictException('Candidate is already converted to an employee');

    const result = await this.prisma.$transaction(async (tx) => {
      const employee = await tx.employee.create({
        data: {
          organizationId,
          employeeCode: dto.employeeCode,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          phone: candidate.phone,
          hireDate: new Date(dto.hireDate),
          departmentId: dto.departmentId || null,
          positionId: dto.positionId || null,
          basicSalary: dto.basicSalary || 0,
          status: EmployeeStatus.PROBATION,
        },
      });

      await tx.employeeHistory.create({
        data: {
          organizationId,
          employeeId: employee.id,
          eventType: 'HIRE_CONVERSION',
          description: `Converted from candidate ${candidate.firstName} ${candidate.lastName}`,
          createdByUserId: currentUserId,
        },
      });

      // Update application stage to HIRED if any active application exists
      await tx.jobApplication.updateMany({
        where: { candidateId, organizationId },
        data: { stage: ApplicationStage.HIRED },
      });

      return employee;
    });

    await this.auditLogService.log({
      organizationId,
      userId: currentUserId,
      action: 'CANDIDATE_CONVERTED_TO_EMPLOYEE',
      entity: 'Employee',
      entityId: result.id,
    });

    return result;
  }
}
