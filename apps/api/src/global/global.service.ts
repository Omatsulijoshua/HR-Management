import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCurrencyDto,
  CreateExchangeRateDto,
  CreateTaxConfigDto,
  CreateWorkPermitDto,
} from './dto/global.dto';

@Injectable()
export class GlobalService {
  constructor(private readonly prisma: PrismaService) {}

  // Currencies
  async createCurrency(organizationId: string, dto: CreateCurrencyDto) {
    const existing = await this.prisma.currency.findUnique({
      where: {
        organizationId_code: {
          organizationId,
          code: dto.code.toUpperCase(),
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Currency code ${dto.code} already exists for organization.`);
    }

    if (dto.isBaseCurrency) {
      // Unset previous base currency
      await this.prisma.currency.updateMany({
        where: { organizationId, isBaseCurrency: true },
        data: { isBaseCurrency: false },
      });
    }

    return this.prisma.currency.create({
      data: {
        organizationId,
        code: dto.code.toUpperCase(),
        symbol: dto.symbol,
        name: dto.name,
        isBaseCurrency: dto.isBaseCurrency || false,
      },
    });
  }

  async getCurrencies(organizationId: string) {
    return this.prisma.currency.findMany({
      where: { organizationId },
      orderBy: { code: 'asc' },
    });
  }

  // Exchange Rates
  async setExchangeRate(organizationId: string, dto: CreateExchangeRateDto) {
    return this.prisma.exchangeRate.create({
      data: {
        organizationId,
        fromCurrency: dto.fromCurrency.toUpperCase(),
        toCurrency: dto.toCurrency.toUpperCase(),
        rate: dto.rate,
      },
    });
  }

  async getExchangeRates(organizationId: string) {
    return this.prisma.exchangeRate.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async convertAmount(organizationId: string, amount: number, fromCurrency: string, toCurrency: string) {
    if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
      return { amount, convertedAmount: amount, rate: 1.0 };
    }

    const rateRecord = await this.prisma.exchangeRate.findFirst({
      where: {
        organizationId,
        fromCurrency: fromCurrency.toUpperCase(),
        toCurrency: toCurrency.toUpperCase(),
      },
      orderBy: { createdAt: 'desc' },
    });

    const rate = rateRecord ? rateRecord.rate : 1.0;
    const convertedAmount = Math.round(amount * rate * 100) / 100;

    return { amount, convertedAmount, rate };
  }

  // Tax Configurations
  async upsertTaxConfig(organizationId: string, dto: CreateTaxConfigDto) {
    return this.prisma.countryTaxConfig.upsert({
      where: {
        organizationId_countryCode: {
          organizationId,
          countryCode: dto.countryCode.toUpperCase(),
        },
      },
      update: {
        countryName: dto.countryName,
        taxAuthorityName: dto.taxAuthorityName,
        defaultTaxRate: dto.defaultTaxRate,
        pensionRate: dto.pensionRate,
      },
      create: {
        organizationId,
        countryCode: dto.countryCode.toUpperCase(),
        countryName: dto.countryName,
        taxAuthorityName: dto.taxAuthorityName,
        defaultTaxRate: dto.defaultTaxRate,
        pensionRate: dto.pensionRate,
      },
    });
  }

  async getTaxConfigs(organizationId: string) {
    return this.prisma.countryTaxConfig.findMany({
      where: { organizationId },
      orderBy: { countryName: 'asc' },
    });
  }

  // Work Permits
  async createWorkPermit(organizationId: string, dto: CreateWorkPermitDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { id: dto.employeeId, organizationId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found in organization.');
    }

    return this.prisma.workPermit.create({
      data: {
        organizationId,
        employeeId: dto.employeeId,
        permitType: dto.permitType,
        permitNumber: dto.permitNumber,
        issuingCountry: dto.issuingCountry,
        expiryDate: new Date(dto.expiryDate),
        status: dto.status || 'ACTIVE',
      },
      include: { employee: true },
    });
  }

  async getWorkPermits(organizationId: string) {
    return this.prisma.workPermit.findMany({
      where: { organizationId },
      include: { employee: true },
      orderBy: { expiryDate: 'asc' },
    });
  }
}
