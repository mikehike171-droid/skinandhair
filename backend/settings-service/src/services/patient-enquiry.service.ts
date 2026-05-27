import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientEnquiry } from '../entities/patient-enquiry.entity';

@Injectable()
export class PatientEnquiryService {
  constructor(
    @InjectRepository(PatientEnquiry)
    private readonly enquiryRepository: Repository<PatientEnquiry>,
  ) {}

  async create(data: Partial<PatientEnquiry>): Promise<PatientEnquiry> {
    const enquiry = this.enquiryRepository.create(data);
    return await this.enquiryRepository.save(enquiry);
  }

  async findOne(id: number): Promise<PatientEnquiry> {
    return await this.enquiryRepository.findOneBy({ id });
  }

  async findAll(filters: {
    location_id?: number;
    startDate?: string;
    endDate?: string;
    enquiryFor?: string;
    leadRepresentative?: string;
    enquiryType?: string;
    sourceOfEnquiry?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: PatientEnquiry[]; total: number }> {
    const { location_id, startDate, endDate, enquiryFor, leadRepresentative, enquiryType, sourceOfEnquiry, page = 1, limit = 10 } = filters;
    
    const query = this.enquiryRepository.createQueryBuilder('enquiry');

    if (location_id) {
      query.andWhere('enquiry.locationId = :location_id', { location_id });
    }

    if (startDate && endDate) {
      query.andWhere('enquiry.dateToFollow BETWEEN :startDate AND :endDate', { startDate, endDate });
    } else if (startDate) {
      query.andWhere('enquiry.dateToFollow >= :startDate', { startDate });
    } else if (endDate) {
      query.andWhere('enquiry.dateToFollow <= :endDate', { endDate });
    }

    if (enquiryFor) {
      query.andWhere('enquiry.enquiryFor LIKE :enquiryFor', { enquiryFor: `%${enquiryFor}%` });
    }

    if (leadRepresentative) {
      query.andWhere('enquiry.leadRepresentative = :leadRepresentative', { leadRepresentative });
    }

    if (enquiryType) {
      query.andWhere('enquiry.enquiryType = :enquiryType', { enquiryType });
    }

    if (sourceOfEnquiry) {
      query.andWhere('enquiry.sourceOfEnquiry = :sourceOfEnquiry', { sourceOfEnquiry });
    }

    query.orderBy('enquiry.createdAt', 'DESC');
    
    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }
}
