import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseClaimDto, UpdateExpenseStatusDto } from './dto/expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async createClaim(tenantId: string, employeeId: string, dto: CreateExpenseClaimDto) {
    const claimCount = await this.prisma.expenseClaim.count({
      where: { organizationId: tenantId },
    });
    const claimNumber = `CLM-${String(claimCount + 1).padStart(5, '0')}`;

    return this.prisma.expenseClaim.create({
      data: {
        organizationId: tenantId,
        claimNumber,
        employeeId,
        title: dto.title,
        category: dto.category ?? 'SUPPLIES',
        amount: dto.amount,
        currency: dto.currency ?? 'NGN',
        receiptUrl: dto.receiptUrl,
        description: dto.description,
        status: 'SUBMITTED',
      },
      include: { employee: true },
    });
  }

  async findAllClaims(tenantId: string) {
    return this.prisma.expenseClaim.findMany({
      where: { organizationId: tenantId },
      include: { employee: true },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async findOneClaim(tenantId: string, id: string) {
    const claim = await this.prisma.expenseClaim.findFirst({
      where: { id, organizationId: tenantId },
      include: { employee: true },
    });

    if (!claim) {
      throw new NotFoundException(`Expense claim with ID ${id} not found`);
    }

    return claim;
  }

  async updateStatus(tenantId: string, id: string, dto: UpdateExpenseStatusDto) {
    await this.findOneClaim(tenantId, id);

    return this.prisma.expenseClaim.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.managerNotes && { managerNotes: dto.managerNotes }),
        ...(dto.financeNotes && { financeNotes: dto.financeNotes }),
        ...(dto.status === 'DISBURSED' && { disbursedAt: new Date() }),
      },
      include: { employee: true },
    });
  }
}
