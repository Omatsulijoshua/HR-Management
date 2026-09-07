import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;
  let jwtService: any;
  let auditLogService: any;

  beforeEach(async () => {
    prismaService = {
      user: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      organization: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      role: {
        create: jest.fn(),
      },
      permission: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      rolePermission: {
        createMany: jest.fn(),
      },
      session: {
        create: jest.fn(),
        updateMany: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
      },
      refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      passwordResetToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(prismaService)),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked_jwt_token'),
    };

    auditLogService = {
      log: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaService },
        { provide: JwtService, useValue: jwtService },
        {
          provide: ConfigService,
          useValue: { get: jest.fn((key, def) => def) },
        },
        { provide: AuditLogService, useValue: auditLogService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      prismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unknown@test.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if account is locked', async () => {
      prismaService.user.findFirst.mockResolvedValue({
        id: 'u-1',
        email: 'locked@test.com',
        lockedUntil: new Date(Date.now() + 10 * 60 * 1000),
      });

      await expect(
        service.login({ email: 'locked@test.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should increment failed attempts and throw if password invalid', async () => {
      const hashedPassword = await bcrypt.hash('correct_pass', 10);
      prismaService.user.findFirst.mockResolvedValue({
        id: 'u-1',
        email: 'test@test.com',
        passwordHash: hashedPassword,
        failedLoginAttempts: 0,
        lockedUntil: null,
        organizationId: 'org-1',
      });

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong_pass' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'u-1' },
        data: expect.objectContaining({ failedLoginAttempts: 1 }),
      });
    });

    it('should authenticate user and return tokens on valid password', async () => {
      const hashedPassword = await bcrypt.hash('correct_pass', 10);
      prismaService.user.findFirst.mockResolvedValue({
        id: 'u-1',
        email: 'test@test.com',
        passwordHash: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-1',
        organization: { id: 'org-1', name: 'Acme' },
        failedLoginAttempts: 0,
        lockedUntil: null,
        role: { name: 'Owner', permissions: [] },
      });

      const res = await service.login({ email: 'test@test.com', password: 'correct_pass' });
      expect(res.user.email).toBe('test@test.com');
      expect(res.tokens.accessToken).toBe('mocked_jwt_token');
    });
  });
});
