import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TenantGuard } from './guards/tenant.guard';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, TenantGuard],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
