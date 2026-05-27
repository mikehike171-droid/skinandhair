import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConsultationService } from '../services/consultation.service';

@ApiTags('Consultation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('consultation')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Post()
  @ApiOperation({ summary: 'Record consultation fee' })
  async recordConsultation(@Request() req, @Body() consultationData: any, @Query('locationId') queryLocationId?: number) {
    const locationId = queryLocationId || req.user.location_id || req.user.primary_location_id || 1;
    return this.consultationService.recordConsultation(consultationData, locationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all consultation fees' })
  async getConsultations(@Request() req, @Query('locationId') queryLocationId?: number) {
    const locationId = queryLocationId || req.user.location_id || req.user.primary_location_id || 1;
    return this.consultationService.findAll(locationId);
  }

  @Get('doctor')
  @ApiOperation({ summary: 'Get consultation fees for logged-in doctor' })
  async getDoctorConsultations(
    @Request() req, 
    @Query('date') date?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const doctorId = req.user.id || req.user.userId || req.user.sub;
    return this.consultationService.findByDoctor(doctorId, fromDate || date, toDate);
  }
}
