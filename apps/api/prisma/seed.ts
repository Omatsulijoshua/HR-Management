import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding initial platform baseline data...');

  // Create baseline permissions
  const permissionsData = [
    { code: 'employees.view', module: 'employees', description: 'View employee profiles' },
    { code: 'employees.create', module: 'employees', description: 'Create employee accounts' },
    { code: 'employees.update', module: 'employees', description: 'Update employee profiles' },
    { code: 'employees.delete', module: 'employees', description: 'Delete employee records' },
    { code: 'payroll.view', module: 'payroll', description: 'View payroll records' },
    { code: 'payroll.process', module: 'payroll', description: 'Process organization payroll' },
    { code: 'leave.view', module: 'leave', description: 'View leave requests' },
    { code: 'leave.approve', module: 'leave', description: 'Approve leave requests' },
    { code: 'system.admin', module: 'system', description: 'Full administrator access' },
  ];

  for (const perm of permissionsData) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
  }

  // Create demo organization
  const demoOrg = await prisma.organization.upsert({
    where: { slug: 'demo-corporation' },
    update: {},
    create: {
      name: 'Demo Corporation',
      slug: 'demo-corporation',
      domain: 'democorp.local',
      industry: 'Technology',
      country: 'Nigeria',
      currency: 'NGN',
      timezone: 'Africa/Lagos',
      status: 'ACTIVE',
      maxEmployees: 100,
    },
  });

  console.log(`✅ Demo Organization created/verified: ${demoOrg.name} (${demoOrg.id})`);

  // Create system role for Demo Organization
  const adminRole = await prisma.role.upsert({
    where: {
      organizationId_name: {
        organizationId: demoOrg.id,
        name: 'Organization Owner',
      },
    },
    update: {},
    create: {
      organizationId: demoOrg.id,
      name: 'Organization Owner',
      description: 'Full management permissions over organization environment',
      isSystemRole: true,
    },
  });

  console.log(`✅ Organization Owner role created: ${adminRole.name}`);
  console.log('🎉 Baseline seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
