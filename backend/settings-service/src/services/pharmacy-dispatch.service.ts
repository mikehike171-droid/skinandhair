import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { PharmacyDispatch } from '../entities/pharmacy-dispatch.entity';
import { PatientExamination } from '../entities/patient-examination.entity';
import { ServiceProduct } from '../entities/service-product.entity';

@Injectable()
export class PharmacyDispatchService {
  private readonly logger = new Logger(PharmacyDispatchService.name);

  constructor(
    @InjectRepository(PharmacyDispatch)
    private dispatchRepository: Repository<PharmacyDispatch>,
    @InjectRepository(PatientExamination)
    private examinationRepository: Repository<PatientExamination>,
    @InjectRepository(ServiceProduct)
    private serviceProductRepository: Repository<ServiceProduct>,
  ) {}

  /**
   * Get doctor-prescribed products for an examination, joined with any existing dispatch records.
   */
  async getDispatchByExamination(examinationId: number): Promise<any> {
    try {
      this.logger.log(`Getting dispatch info for exam: ${examinationId}`);
      const exam = await this.examinationRepository.findOne({ where: { id: examinationId } });
      if (!exam) return { products: [], dispatches: [] };

      // Identify products from master list
      const masterProducts = await this.serviceProductRepository.createQueryBuilder('sp')
        .where('LOWER(sp.type) = :type', { type: 'product' })
        .getMany();
      const productNames = new Set(masterProducts.map(p => p.name.toLowerCase().trim()));

      const services = Array.isArray(exam.services) ? exam.services : [];
      const products = services.filter((s: any) => productNames.has((s.service || '').toLowerCase().trim()));

      // Get all dispatch records for this examination
      const dispatches = await this.dispatchRepository.find({
        where: { examinationId },
        order: { createdAt: 'DESC' },
      });

      return { products, dispatches };
    } catch (error) {
      this.logger.error(`Error in getDispatchByExamination: ${error.message}`, error.stack);
      return { products: [], dispatches: [], error: error.message };
    }
  }

  /**
   * Record a new dispatch for a product.
   */
  async createDispatch(data: {
    examinationId: number;
    patientId: number;
    productName: string;
    doctorQuantity: number;
    doctorDays: number;
    dispatchedQuantity: number;
    dispatchedDays: number;
    notes?: string;
    locationId?: number;
  }): Promise<PharmacyDispatch> {
    try {
      this.logger.log(`Creating dispatch for exam ${data.examinationId}, product: ${data.productName}`);

      // Calculate totals dispatched so far for this product in this exam
      const previousDispatches = await this.dispatchRepository.find({
        where: { examinationId: data.examinationId, productName: data.productName },
      });
      const totalDispatchedDays = previousDispatches.reduce((sum, d) => sum + (d.dispatchedDays || 0), 0);
      const totalDispatchedQty = previousDispatches.reduce((sum, d) => sum + (d.dispatchedQuantity || 0), 0);

      const doctorDays = Number(data.doctorDays) || 0;
      const dispatchedDays = Number(data.dispatchedDays) || 0;
      const dispatchedQuantity = Number(data.dispatchedQuantity) || 0;
      const doctorQuantity = Number(data.doctorQuantity) || 0;
      
      const remainingDays = Math.max(0, doctorDays - totalDispatchedDays - dispatchedDays);
      const dispatchDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + data.dispatchedDays);

      const dispatch = this.dispatchRepository.create({
        examinationId: data.examinationId,
        patientId: data.patientId,
        productName: data.productName,
        doctorQuantity: data.doctorQuantity,
        doctorDays: data.doctorDays,
        dispatchedQuantity: data.dispatchedQuantity,
        dispatchedDays: data.dispatchedDays,
        remainingDays,
        dispatchDate,
        dueDate,
        notes: data.notes,
        locationId: data.locationId,
      });

      const saved = await this.dispatchRepository.save(dispatch);
      this.logger.log(`Dispatch created with ID: ${saved.id}, remaining days: ${remainingDays}`);
      return saved;
    } catch (error) {
      this.logger.error(`Error creating dispatch: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Bulk record multiple dispatches.
   */
  async createBulkDispatch(dispatches: any[]): Promise<PharmacyDispatch[]> {
    try {
      this.logger.log(`Bulk creating ${dispatches.length} dispatches`);
      const results: PharmacyDispatch[] = [];
      for (const data of dispatches) {
        const saved = await this.createDispatch(data);
        results.push(saved);
      }
      return results;
    } catch (error) {
      this.logger.error(`Error in createBulkDispatch: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get the full dispatch tracking list for a location.
   */
  async getDispatchList(locationId?: number, page: number = 1, limit: number = 20, patientId?: number): Promise<any> {
    try {
      const where: any = {};
      if (locationId) where.locationId = locationId;
      if (patientId) where.patientId = patientId;

      const [dispatches, total] = await this.dispatchRepository.findAndCount({
        where,
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      const enhanced = await Promise.all(dispatches.map(async (d) => {
        try {
          const patients = await this.examinationRepository.manager.query(
            `SELECT first_name, last_name, patient_id as patient_code, mobile FROM patients WHERE id = $1`,
            [d.patientId]
          );
          const patient = patients[0] || {};
          const exam = await this.examinationRepository.findOne({
            where: { id: d.examinationId },
            select: ['createdAt'],
          });

          // Recalculate remaining days dynamically based on today vs due date
          const today = new Date();
          const dueDate = d.dueDate ? new Date(d.dueDate) : null;
          const daysUntilDue = dueDate ? Math.ceil((dueDate.getTime() - today.getTime()) / (86400000)) : null;

          return { 
            ...d, 
            patient,
            examDate: exam?.createdAt,
            daysUntilDue,
            isOverdue: daysUntilDue !== null && daysUntilDue < 0,
            isDueSoon: daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 3,
          };
        } catch (e) {
          return { ...d, patient: { first_name: 'Error', last_name: 'Loading' } };
        }
      }));

      return {
        data: enhanced,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Error in getDispatchList: ${error.message}`, error.stack);
      return { data: [], total: 0, page, limit, totalPages: 0 };
    }
  }
}
