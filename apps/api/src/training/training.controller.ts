import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../organizations/guards/tenant.guard';
import { TrainingService } from './training.service';
import {
  CreateTrainingCourseDto,
  EnrollTrainingDto,
  UpdateEnrollmentStatusDto,
} from './dto/training.dto';

@ApiTags('Training & L&D')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post('courses')
  @ApiOperation({ summary: 'Create a training course' })
  async createCourse(@Req() req: any, @Body() dto: CreateTrainingCourseDto) {
    return this.trainingService.createCourse(req.user.organizationId, dto);
  }

  @Get('courses')
  @ApiOperation({ summary: 'Get all training courses' })
  async getCourses(@Req() req: any) {
    return this.trainingService.getCourses(req.user.organizationId);
  }

  @Post('enrollments')
  @ApiOperation({ summary: 'Enroll employee in a training course' })
  async enrollEmployee(@Req() req: any, @Body() dto: EnrollTrainingDto) {
    return this.trainingService.enrollEmployee(req.user.organizationId, dto);
  }

  @Get('enrollments')
  @ApiOperation({ summary: 'Get all training enrollments' })
  async getEnrollments(@Req() req: any, @Query('employeeId') employeeId?: string) {
    return this.trainingService.getEnrollments(req.user.organizationId, employeeId);
  }

  @Patch('enrollments/:id/status')
  @ApiOperation({ summary: 'Update enrollment status and issue certificate' })
  async updateEnrollmentStatus(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateEnrollmentStatusDto) {
    return this.trainingService.updateEnrollmentStatus(req.user.organizationId, id, dto);
  }
}
