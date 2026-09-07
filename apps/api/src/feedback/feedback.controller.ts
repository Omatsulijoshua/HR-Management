import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeedbackService } from './feedback.service';
import { CreateAnonymousFeedbackDto, UpdateFeedbackStatusDto } from './dto/feedback.dto';

@Controller('feedback')
@UseGuards(JwtAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async submitFeedback(@Request() req: any, @Body() dto: CreateAnonymousFeedbackDto) {
    const tenantId = req.user.organizationId;
    return this.feedbackService.submitFeedback(tenantId, dto);
  }

  @Get()
  async findAllFeedback(@Request() req: any) {
    const tenantId = req.user.organizationId;
    return this.feedbackService.findAllFeedback(tenantId);
  }

  @Get(':id')
  async findOneFeedback(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user.organizationId;
    return this.feedbackService.findOneFeedback(tenantId, id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateFeedbackStatusDto,
  ) {
    const tenantId = req.user.organizationId;
    return this.feedbackService.updateStatus(tenantId, id, dto);
  }
}
