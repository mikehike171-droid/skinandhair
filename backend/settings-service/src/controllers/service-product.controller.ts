import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ServiceProductService } from '../services/service-product.service';

@Controller('service-product')
export class ServiceProductController {
  constructor(private readonly serviceProductService: ServiceProductService) {}

  @Get()
  async findAll() {
    return this.serviceProductService.findAll();
  }

  @Post()
  async create(@Body() createDto: { name: string; type?: string; amount?: number; gst?: number; status?: boolean }) {
    return this.serviceProductService.create(createDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.serviceProductService.update(+id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.serviceProductService.remove(+id);
    return { message: 'Service/Product deleted successfully' };
  }

  @Post('seed')
  async seed() {
    await this.serviceProductService.seedData();
    return { message: 'Seed data generated successfully' };
  }
}
