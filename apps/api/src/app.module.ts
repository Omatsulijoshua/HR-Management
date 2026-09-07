import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { EmployeesModule } from './employees/employees.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveModule } from './leave/leave.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PayrollModule } from './payroll/payroll.module';
import { BenefitsModule } from './benefits/benefits.module';
import { CompensationModule } from './compensation/compensation.module';
import { PerformanceModule } from './performance/performance.module';
import { TrainingModule } from './training/training.module';
import { SkillsModule } from './skills/skills.module';
import { CareerModule } from './career/career.module';
import { SuccessionModule } from './succession/succession.module';
import { MobilityModule } from './mobility/mobility.module';
import { SurveysModule } from './surveys/surveys.module';
import { FeedbackModule } from './feedback/feedback.module';
import { EssModule } from './ess/ess.module';
import { MssModule } from './mss/mss.module';
import { AssetsModule } from './assets/assets.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ComplianceModule } from './compliance/compliance.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { GlobalModule } from './global/global.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    RedisModule,
    AuditModule,
    AuthModule,
    OrganizationsModule,
    EmployeesModule,
    AttendanceModule,
    LeaveModule,
    RecruitmentModule,
    OnboardingModule,
    PayrollModule,
    BenefitsModule,
    CompensationModule,
    PerformanceModule,
    TrainingModule,
    SkillsModule,
    CareerModule,
    SuccessionModule,
    MobilityModule,
    SurveysModule,
    FeedbackModule,
    EssModule,
    MssModule,
    AssetsModule,
    ExpensesModule,
    ComplianceModule,
    AnalyticsModule,
    GlobalModule,
    HealthModule,
  ],
})
export class AppModule {}
