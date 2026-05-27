import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EnquiryTypeService } from '../services/enquiry-type.service';
import { EnquiryType } from '../entities/enquiry-type.entity';

@Controller('enquiry-type')
@UseGuards(JwtAuthGuard)
export class EnquiryTypeController {
  constructor(private readonly enquiryTypeService: EnquiryTypeService) {}

  @Get()
  async findAll(): Promise<EnquiryType[]> {
    return this.enquiryTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EnquiryType> {
    return this.enquiryTypeService.findOne(+id);
  }

  @Post()
  async create(@Body() data: Partial<EnquiryType>): Promise<EnquiryType> {
    return this.enquiryTypeService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<EnquiryType>): Promise<EnquiryType> {
    return this.enquiryTypeService.update(+id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.enquiryTypeService.remove(+id);
    return { message: 'Enquiry type deleted successfully' };
  }
}
