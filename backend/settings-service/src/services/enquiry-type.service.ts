import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnquiryType } from '../entities/enquiry-type.entity';

@Injectable()
export class EnquiryTypeService {
  constructor(
    @InjectRepository(EnquiryType)
    private enquiryTypeRepository: Repository<EnquiryType>,
  ) {}

  async findAll(): Promise<EnquiryType[]> {
    return this.enquiryTypeRepository.find({
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<EnquiryType> {
    return this.enquiryTypeRepository.findOne({ where: { id } });
  }

  async create(data: Partial<EnquiryType>): Promise<EnquiryType> {
    const enquiryType = this.enquiryTypeRepository.create(data);
    return this.enquiryTypeRepository.save(enquiryType);
  }

  async update(id: number, data: Partial<EnquiryType>): Promise<EnquiryType> {
    await this.enquiryTypeRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.enquiryTypeRepository.delete(id);
  }
}
