import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProduct } from '../entities/service-product.entity';
import { ServiceProductService } from '../services/service-product.service';
import { ServiceProductController } from '../controllers/service-product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProduct])],
  controllers: [ServiceProductController],
  providers: [ServiceProductService],
  exports: [ServiceProductService],
})
export class ServiceProductModule {}
