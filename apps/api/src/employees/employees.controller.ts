import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../organizations/guards/tenant.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  UpdateEmployeeStatusDto,
  CreateEmergencyContactDto,
  UploadEmployeeDocumentDto,
  QueryEmployeesDto,
} from './dto/employee.dto';

@ApiTags('Employees')
@Controller('employees')
@UseGuards(JwtAuthGuard, TenantGuard)
@ApiBearerAuth()
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Onboard a new employee' })
  async createEmployee(
    @GetUser('organizationId') orgId: string,
    @GetUser('id') currentUserId: string,
    @Body() dto: CreateEmployeeDto,
  ) {
    return this.employeesService.createEmployee(orgId, dto, currentUserId);
  }

  @Get()
  @ApiOperation({ summary: 'List and filter employees' })
  async getEmployees(
    @GetUser('organizationId') orgId: string,
    @Query() query: QueryEmployeesDto,
  ) {
    return this.employeesService.getEmployees(orgId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get complete employee profile details' })
  async getEmployeeById(
    @GetUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.employeesService.getEmployeeById(orgId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update employee profile details' })
  async updateEmployee(
    @GetUser('organizationId') orgId: string,
    @GetUser('id') currentUserId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeesService.updateEmployee(orgId, id, dto, currentUserId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update employee status (Probation, Active, Terminated)' })
  async updateStatus(
    @GetUser('organizationId') orgId: string,
    @GetUser('id') currentUserId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeStatusDto,
  ) {
    return this.employeesService.updateStatus(orgId, id, dto, currentUserId);
  }

  @Post(':id/emergency-contacts')
  @ApiOperation({ summary: 'Add emergency contact to employee' })
  async addEmergencyContact(
    @GetUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body() dto: CreateEmergencyContactDto,
  ) {
    return this.employeesService.addEmergencyContact(orgId, id, dto);
  }

  @Delete(':id/emergency-contacts/:contactId')
  @ApiOperation({ summary: 'Delete employee emergency contact' })
  async deleteEmergencyContact(
    @GetUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Param('contactId') contactId: string,
  ) {
    return this.employeesService.deleteEmergencyContact(orgId, id, contactId);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Upload document for employee' })
  async addDocument(
    @GetUser('organizationId') orgId: string,
    @Param('id') id: string,
    @Body() dto: UploadEmployeeDocumentDto,
  ) {
    return this.employeesService.addDocument(orgId, id, dto);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get employee chronological history timeline' })
  async getTimeline(
    @GetUser('organizationId') orgId: string,
    @Param('id') id: string,
  ) {
    return this.employeesService.getTimeline(orgId, id);
  }
}
