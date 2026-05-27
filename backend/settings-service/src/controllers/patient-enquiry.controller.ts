import { Controller, Post, Get, Body, Param, UseGuards, Query } from '@nestjs/common';
import { PatientEnquiryService } from '../services/patient-enquiry.service';
import { PatientEnquiry } from '../entities/patient-enquiry.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('patient-enquiry')
@UseGuards(JwtAuthGuard)
export class PatientEnquiryController {
  constructor(private readonly enquiryService: PatientEnquiryService) {}

  @Post()
  async create(@Body() data: Partial<PatientEnquiry>): Promise<PatientEnquiry> {
    return await this.enquiryService.create(data);
  }

  @Get()
  async findAll(
    @Query('location_id') location_id?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('enquiryFor') enquiryFor?: string,
    @Query('leadRepresentative') leadRepresentative?: string,
    @Query('enquiryType') enquiryType?: string,
    @Query('sourceOfEnquiry') sourceOfEnquiry?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<{ data: PatientEnquiry[]; total: number }> {
    return await this.enquiryService.findAll({
      location_id,
      startDate,
      endDate,
      enquiryFor,
      leadRepresentative,
      enquiryType,
      sourceOfEnquiry,
      page,
      limit,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PatientEnquiry> {
    return await this.enquiryService.findOne(+id);
  }
}
