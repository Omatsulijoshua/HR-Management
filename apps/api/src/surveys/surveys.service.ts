import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSurveyDto, AddQuestionDto, SubmitSurveyResponseDto } from './dto/surveys.dto';

@Injectable()
export class SurveysService {
  constructor(private readonly prisma: PrismaService) {}

  async createSurvey(tenantId: string, dto: CreateSurveyDto) {
    const existing = await this.prisma.engagementSurvey.findUnique({
      where: {
        organizationId_code: {
          organizationId: tenantId,
          code: dto.code,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Survey with code '${dto.code}' already exists`);
    }

    return this.prisma.engagementSurvey.create({
      data: {
        organizationId: tenantId,
        title: dto.title,
        code: dto.code,
        description: dto.description,
        type: dto.type ?? 'PULSE',
        targetDepartmentId: dto.targetDepartmentId,
        status: 'ACTIVE',
      },
      include: {
        questions: true,
      },
    });
  }

  async addQuestion(tenantId: string, dto: AddQuestionDto) {
    const survey = await this.prisma.engagementSurvey.findFirst({
      where: { id: dto.surveyId, organizationId: tenantId },
    });

    if (!survey) {
      throw new NotFoundException(`Survey with ID ${dto.surveyId} not found`);
    }

    return this.prisma.surveyQuestion.create({
      data: {
        surveyId: dto.surveyId,
        questionText: dto.questionText,
        type: dto.type ?? 'RATING_1_5',
        options: dto.options ?? {},
      },
    });
  }

  async submitResponse(tenantId: string, employeeId: string | undefined, dto: SubmitSurveyResponseDto) {
    const survey = await this.prisma.engagementSurvey.findFirst({
      where: { id: dto.surveyId, organizationId: tenantId },
    });

    if (!survey) {
      throw new NotFoundException(`Survey with ID ${dto.surveyId} not found`);
    }

    return this.prisma.surveyResponse.create({
      data: {
        organizationId: tenantId,
        surveyId: dto.surveyId,
        employeeId: employeeId ?? null,
        answers: dto.answers,
        score: dto.score ?? 4.0,
      },
    });
  }

  async findAllSurveys(tenantId: string) {
    return this.prisma.engagementSurvey.findMany({
      where: { organizationId: tenantId },
      include: {
        questions: true,
        _count: {
          select: { responses: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneSurvey(tenantId: string, id: string) {
    const survey = await this.prisma.engagementSurvey.findFirst({
      where: { id, organizationId: tenantId },
      include: {
        questions: true,
        responses: true,
      },
    });

    if (!survey) {
      throw new NotFoundException(`Survey with ID ${id} not found`);
    }

    return survey;
  }
}
