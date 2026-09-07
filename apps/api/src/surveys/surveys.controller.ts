import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto, AddQuestionDto, SubmitSurveyResponseDto } from './dto/surveys.dto';

@Controller('surveys')
@UseGuards(JwtAuthGuard)
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post()
  async createSurvey(@Request() req: any, @Body() dto: CreateSurveyDto) {
    const tenantId = req.user.organizationId;
    return this.surveysService.createSurvey(tenantId, dto);
  }

  @Post('questions')
  async addQuestion(@Request() req: any, @Body() dto: AddQuestionDto) {
    const tenantId = req.user.organizationId;
    return this.surveysService.addQuestion(tenantId, dto);
  }

  @Post('responses')
  async submitResponse(@Request() req: any, @Body() dto: SubmitSurveyResponseDto) {
    const tenantId = req.user.organizationId;
    const employeeId = req.user.employeeId;
    return this.surveysService.submitResponse(tenantId, employeeId, dto);
  }

  @Get()
  async findAllSurveys(@Request() req: any) {
    const tenantId = req.user.organizationId;
    return this.surveysService.findAllSurveys(tenantId);
  }

  @Get(':id')
  async findOneSurvey(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user.organizationId;
    return this.surveysService.findOneSurvey(tenantId, id);
  }
}
