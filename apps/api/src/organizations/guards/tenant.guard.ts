import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.organizationId) {
      throw new ForbiddenException('User is not associated with an organization context');
    }

    const headerTenantId = request.headers['x-organization-id'];
    if (headerTenantId && headerTenantId !== user.organizationId) {
      throw new ForbiddenException('Tenant context mismatch. Cross-organization operations forbidden.');
    }

    const paramOrgId = request.params.organizationId || request.params.orgId;
    if (paramOrgId && paramOrgId !== user.organizationId) {
      throw new ForbiddenException('Access denied. You cannot query or modify another organization’s data.');
    }

    return true;
  }
}
