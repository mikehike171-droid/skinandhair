import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProduct } from '../entities/service-product.entity';

@Injectable()
export class ServiceProductService {
  constructor(
    @InjectRepository(ServiceProduct)
    private serviceProductRepository: Repository<ServiceProduct>,
  ) {}

  async findAll(): Promise<ServiceProduct[]> {
    return this.serviceProductRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<ServiceProduct> {
    return this.serviceProductRepository.findOne({ where: { id } });
  }

  async create(serviceProductData: Partial<ServiceProduct>): Promise<ServiceProduct> {
    const newServiceProduct = this.serviceProductRepository.create(serviceProductData);
    return this.serviceProductRepository.save(newServiceProduct);
  }

  async update(id: number, data: Partial<ServiceProduct>): Promise<ServiceProduct> {
    await this.serviceProductRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.serviceProductRepository.delete(id);
  }

  async seedData(): Promise<void> {
    const defaultServices = [
      { name: 'GFC Therapy - Hair', amount: 5000 },
      { name: 'Laser Hair Removal - Face', amount: 3500 },
      { name: 'Hair Consultation', amount: 500 },
      { name: 'Glutathione IV', amount: 2500 },
      { name: 'Tattoo Removal', amount: 1500 }
    ];

    for (const service of defaultServices) {
      const exists = await this.serviceProductRepository.findOne({ where: { name: service.name } });
      if (!exists) {
        await this.create({ ...service, type: 'Service', status: true });
      } else if (parseFloat(exists.amount as any) === 0) {
        // Update existing ones if price is 0
        await this.update(exists.id, { amount: service.amount });
      }
    }
  }
}
