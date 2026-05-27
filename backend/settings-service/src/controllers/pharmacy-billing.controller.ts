import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PharmacyBillingService } from '../services/pharmacy-billing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pharmacy-billing')
@UseGuards(JwtAuthGuard)
export class PharmacyBillingController {
  constructor(private readonly billingService: PharmacyBillingService) {}

  @Get('examination/:id')
  async getBillingByExamination(@Param('id', ParseIntPipe) examinationId: number) {
    return this.billingService.getBillingByExamination(examinationId);
  }

  @Post(':id/payment')
  async addPayment(
    @Param('id', ParseIntPipe) billingId: number,
    @Body() paymentData: { method: string; amount: number; notes?: string },
  ) {
    return this.billingService.addPayment(billingId, paymentData);
  }

  @Get('dues')
  async getDueList(
    @Query('locationId') locationId?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.billingService.getDueList(
      locationId ? parseInt(locationId) : undefined,
      parseInt(page),
      parseInt(limit)
    );
  }
}

