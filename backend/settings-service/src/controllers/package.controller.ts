import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PackageService } from '../services/package.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('packages')
@UseGuards(JwtAuthGuard)
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get()
  findAll() {
    return this.packageService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.packageService.create(data);
  }

  @Post('assign')
  assignToPatient(@Body() data: any) {
    return this.packageService.assignToPatient(data);
  }

  @Get('patient/:patientId')
  getPatientPackages(@Param('patientId') patientId: string) {
    return this.packageService.getPatientPackages(patientId);
  }

  @Post('use-session')
  useSession(@Body() data: any) {
    return this.packageService.useSession(data);
  }
}
