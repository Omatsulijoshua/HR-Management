import { Test, TestingModule } from '@nestjs/testing';
import { GlobalService } from './global.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('GlobalService', () => {
  let service: GlobalService;
  let prisma: PrismaService;

  const mockPrismaService = {
    currency: {
      findUnique: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    exchangeRate: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    countryTaxConfig: {
      upsert: jest.fn(),
      findMany: jest.fn(),
    },
    employee: {
      findFirst: jest.fn(),
    },
    workPermit: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<GlobalService>(GlobalService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCurrency', () => {
    it('should create currency successfully', async () => {
      mockPrismaService.currency.findUnique.mockResolvedValue(null);
      mockPrismaService.currency.create.mockResolvedValue({
        id: 'curr-1',
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
      });

      const result = await service.createCurrency('org-1', {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
      });

      expect(result.code).toBe('USD');
      expect(prisma.currency.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if currency exists', async () => {
      mockPrismaService.currency.findUnique.mockResolvedValue({ id: 'curr-existing' });

      await expect(
        service.createCurrency('org-1', {
          code: 'USD',
          symbol: '$',
          name: 'US Dollar',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('convertAmount', () => {
    it('should return converted amount using exchange rate', async () => {
      mockPrismaService.exchangeRate.findFirst.mockResolvedValue({
        rate: 1550.5,
      });

      const res = await service.convertAmount('org-1', 100, 'USD', 'NGN');

      expect(res.convertedAmount).toBe(155050);
      expect(res.rate).toBe(1550.5);
    });
  });

  describe('createWorkPermit', () => {
    it('should create work permit for employee', async () => {
      mockPrismaService.employee.findFirst.mockResolvedValue({ id: 'emp-1' });
      mockPrismaService.workPermit.create.mockResolvedValue({
        id: 'permit-1',
        permitNumber: 'WP-998822',
        status: 'ACTIVE',
      });

      const res = await service.createWorkPermit('org-1', {
        employeeId: 'emp-1',
        permitType: 'H1B Visa',
        permitNumber: 'WP-998822',
        issuingCountry: 'USA',
        expiryDate: '2027-12-31',
      });

      expect(res.permitNumber).toBe('WP-998822');
      expect(prisma.workPermit.create).toHaveBeenCalled();
    });
  });
});
