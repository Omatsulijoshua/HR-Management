import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit/audit.service';
import {
  RegisterOrganizationDto,
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto/auth.dto';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async registerOrganization(dto: RegisterOrganizationDto, ipAddress?: string, userAgent?: string) {
    const slug =
      dto.organizationSlug ||
      dto.organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');

    const existingOrg = await this.prisma.organization.findUnique({ where: { slug } });
    if (existingOrg) {
      throw new BadRequestException('Organization slug/name already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: dto.organizationName,
          slug,
          status: 'ACTIVE',
        },
      });

      const ownerRole = await tx.role.create({
        data: {
          organizationId: organization.id,
          name: 'Organization Owner',
          description: 'Full administrative access over organization resources',
          isSystemRole: true,
        },
      });

      const permissions = await tx.permission.findMany();
      if (permissions.length > 0) {
        await tx.rolePermission.createMany({
          data: permissions.map((p) => ({
            roleId: ownerRole.id,
            permissionId: p.id,
          })),
        });
      }

      const user = await tx.user.create({
        data: {
          organizationId: organization.id,
          roleId: ownerRole.id,
          email: dto.email.toLowerCase(),
          passwordHash: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
          status: 'ACTIVE',
          isEmailVerified: true,
        },
      });

      return { organization, user };
    });

    await this.auditLogService.log({
      organizationId: result.organization.id,
      userId: result.user.id,
      action: 'ORGANIZATION_REGISTERED',
      entity: 'Organization',
      entityId: result.organization.id,
      ipAddress,
      userAgent,
    });

    const tokens = await this.generateTokens(result.user.id, result.organization.id);
    await this.createSession(result.user.id, result.organization.id, tokens.accessToken, ipAddress, userAgent);

    return {
      organization: result.organization,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
      },
      tokens,
    };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    let organizationId: string | undefined;

    if (dto.organizationSlug) {
      const org = await this.prisma.organization.findUnique({
        where: { slug: dto.organizationSlug },
      });
      if (org) organizationId = org.id;
    }

    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email.toLowerCase(),
        ...(organizationId ? { organizationId } : {}),
      },
      include: {
        organization: true,
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedException(
        `Account is locked due to multiple failed login attempts. Try again in ${minutesRemaining} minutes.`,
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      const failedAttempts = user.failedLoginAttempts + 1;
      let lockedUntil: Date | null = null;

      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedAttempts,
          lockedUntil,
        },
      });

      await this.auditLogService.log({
        organizationId: user.organizationId,
        userId: user.id,
        action: 'LOGIN_FAILED',
        entity: 'User',
        entityId: user.id,
        ipAddress,
        userAgent,
      });

      throw new UnauthorizedException(
        lockedUntil
          ? 'Account locked for 15 minutes due to multiple failed attempts.'
          : 'Invalid email or password',
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    const tokens = await this.generateTokens(user.id, user.organizationId);
    await this.createSession(user.id, user.organizationId, tokens.accessToken, ipAddress, userAgent);

    await this.auditLogService.log({
      organizationId: user.organizationId,
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      entity: 'User',
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    const permissions = user.role?.permissions.map((rp) => rp.permission.code) || [];

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: user.organizationId,
        organization: user.organization,
        role: user.role?.name || null,
        permissions,
      },
      tokens,
    };
  }

  async logout(userId: string, refreshToken?: string, ipAddress?: string, userAgent?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { userId, token: refreshToken },
        data: { isRevoked: true },
      });
    }

    await this.prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });

    await this.auditLogService.log({
      userId,
      action: 'LOGOUT',
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });

    return { message: 'Logged out successfully' };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    const tokens = await this.generateTokens(storedToken.userId, storedToken.user.organizationId);
    return tokens;
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      return { message: 'If the email exists, a password reset link has been dispatched.' };
    }

    const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });

    await this.auditLogService.log({
      organizationId: user.organizationId,
      userId: user.id,
      action: 'PASSWORD_RESET_REQUESTED',
      entity: 'User',
      entityId: user.id,
    });

    return {
      message: 'If the email exists, a password reset link has been dispatched.',
      debugResetToken: resetToken,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.isUsed || tokenRecord.expiresAt < new Date()) {
      throw new BadRequestException('Password reset token is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: tokenRecord.userId },
        data: {
          passwordHash: hashedPassword,
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { isUsed: true },
      }),
    ]);

    await this.auditLogService.log({
      organizationId: tokenRecord.user.organizationId,
      userId: tokenRecord.userId,
      action: 'PASSWORD_RESET_COMPLETED',
      entity: 'User',
      entityId: tokenRecord.userId,
    });

    return { message: 'Password has been reset successfully' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const record = await this.prisma.emailVerificationToken.findUnique({
      where: { token: dto.token },
    });

    if (!record || record.isUsed || record.expiresAt < new Date()) {
      throw new BadRequestException('Email verification token is invalid or expired');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { isEmailVerified: true },
      }),
      this.prisma.emailVerificationToken.update({
        where: { id: record.id },
        data: { isUsed: true },
      }),
    ]);

    return { message: 'Email verified successfully' };
  }

  async getActiveSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId, isRevoked: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });

    return { message: 'Session revoked successfully' };
  }

  private async generateTokens(userId: string, organizationId: string) {
    const payload = { sub: userId, organizationId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET', 'dev_secret_jwt_key'),
      expiresIn: '15m',
    });

    const refreshTokenString =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshTokenString,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenString,
      expiresIn: '15m',
    };
  }

  private async createSession(
    userId: string,
    organizationId: string,
    token: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return this.prisma.session.create({
      data: {
        userId,
        organizationId,
        token,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }
}
