import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PharmacyDispatchService } from '../services/pharmacy-dispatch.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pharmacy-dispatch')
@UseGuards(JwtAuthGuard)
export class PharmacyDispatchController {
  constructor(private readonly dispatchService: PharmacyDispatchService) {}

  @Get('examination/:id')
  async getByExamination(@Param('id', ParseIntPipe) examinationId: number) {
    return this.dispatchService.getDispatchByExamination(examinationId);
  }

  @Post()
  async createDispatch(@Body() body: {
    examinationId: number;
    patientId: number;
    productName: string;
    doctorQuantity: number;
    doctorDays: number;
    dispatchedQuantity: number;
    dispatchedDays: number;
    notes?: string;
    locationId?: number;
  }) {
    return this.dispatchService.createDispatch(body);
  }

  @Post('bulk')
  async bulkCreateDispatch(@Body() body: { dispatches: any[] }) {
    return this.dispatchService.createBulkDispatch(body.dispatches);
  }

  @Get('list')
  async getDispatchList(
    @Query('locationId') locationId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('patientId') patientId?: string,
  ) {
    return this.dispatchService.getDispatchList(
      locationId ? parseInt(locationId) : undefined,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      patientId ? parseInt(patientId) : undefined,
    );
  }
}
