import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExpensesService } from './expenses.service';
import { CreateExpenseClaimDto, UpdateExpenseStatusDto } from './dto/expenses.dto';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async createClaim(@Request() req: any, @Body() dto: CreateExpenseClaimDto) {
    const tenantId = req.user.organizationId;
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new ForbiddenException('User is not linked to an employee record');
    }
    return this.expensesService.createClaim(tenantId, employeeId, dto);
  }

  @Get()
  async findAllClaims(@Request() req: any) {
    const tenantId = req.user.organizationId;
    return this.expensesService.findAllClaims(tenantId);
  }

  @Get(':id')
  async findOneClaim(@Request() req: any, @Param('id') id: string) {
    const tenantId = req.user.organizationId;
    return this.expensesService.findOneClaim(tenantId, id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateExpenseStatusDto,
  ) {
    const tenantId = req.user.organizationId;
    return this.expensesService.updateStatus(tenantId, id, dto);
  }
}
