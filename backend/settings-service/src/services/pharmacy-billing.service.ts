import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, ILike } from 'typeorm';
import { PharmacyBilling } from '../entities/pharmacy-billing.entity';
import { PharmacyPaymentInstallment } from '../entities/pharmacy-payment-installment.entity';
import { PatientExamination } from '../entities/patient-examination.entity';
import { ServiceProduct } from '../entities/service-product.entity';

@Injectable()
export class PharmacyBillingService {
  private readonly logger = new Logger(PharmacyBillingService.name);

  constructor(
    @InjectRepository(PharmacyBilling)
    private billingRepository: Repository<PharmacyBilling>,
    @InjectRepository(PharmacyPaymentInstallment)
    private installmentRepository: Repository<PharmacyPaymentInstallment>,
    @InjectRepository(PatientExamination)
    private examinationRepository: Repository<PatientExamination>,
    @InjectRepository(ServiceProduct)
    private serviceProductRepository: Repository<ServiceProduct>,
  ) {}

  async getBillingByExamination(examinationId: number): Promise<any> {
    try {
      this.logger.log(`Fetching billing for examination: ${examinationId}`);
      
      const exam = await this.examinationRepository.findOne({ where: { id: examinationId } });
      if (!exam) {
        this.logger.warn(`Examination ${examinationId} not found`);
        return { totalAmount: 0, paidAmount: 0, dueAmount: 0, installments: [] };
      }

      // Get all products from master to identify them correctly (case-insensitive)
      let productMap = new Map<string, any>();
      try {
        const masterProducts = await this.serviceProductRepository.find();
        productMap = new Map(masterProducts.map(p => [
          (p.name || '').toLowerCase().trim(),
          p
        ]));
      } catch (e) {
        this.logger.error('Failed to fetch master products:', e.message);
      }

      // Calculate current total from products in services array
      let currentTotal = 0;
      const services = Array.isArray(exam.services) ? exam.services : [];
      services.forEach((s: any) => {
        const name = (s.service || '').toLowerCase().trim();
        if (productMap.has(name)) {
          const masterItem = productMap.get(name);
          // Only include items of type 'Product' in Pharmacy billing
          if (masterItem.type === 'Product') {
            const masterPrice = parseFloat(masterItem.amount as any) || 0;
            const price = masterPrice; // User requested dynamic price from master list
            const qty = (s.quantity === undefined || s.quantity === null || s.quantity === '') ? 1 : parseInt(s.quantity);
            currentTotal += (price * qty);
          }
        }
      });

      this.logger.log(`Calculated current total for exam ${examinationId}: ${currentTotal}`);

      let billing = await this.billingRepository.findOne({ where: { examinationId } });
      
      if (!billing) {
        this.logger.log(`Billing not found for exam ${examinationId}. Initializing...`);
        try {
          billing = this.billingRepository.create({
            examinationId,
            patientId: exam.patientId,
            totalAmount: currentTotal,
            paidAmount: 0,
            dueAmount: currentTotal,
          });
          billing = await this.billingRepository.save(billing);
          this.logger.log(`New billing created with ID: ${billing.id}`);
        } catch (saveError) {
          this.logger.error(`Failed to save new billing: ${saveError.message}`);
          return { examinationId, totalAmount: currentTotal, paidAmount: 0, dueAmount: currentTotal, installments: [] };
        }
      } else {
        // Sync billing if total has changed
        const existingTotal = parseFloat(billing.totalAmount as any);
        if (existingTotal !== currentTotal) {
          this.logger.log(`Syncing billing total for exam ${examinationId}: ${existingTotal} -> ${currentTotal}`);
          billing.totalAmount = currentTotal;
          billing.dueAmount = Math.max(0, currentTotal - parseFloat(billing.paidAmount as any));
          billing = await this.billingRepository.save(billing);
        }
      }

      const installments = await this.installmentRepository.find({
        where: { pharmacyBillingId: billing.id },
        order: { installmentNumber: 'ASC' },
      }).catch(e => {
        this.logger.error(`Failed to fetch installments: ${e.message}`);
        return [];
      });

      return { ...billing, installments };
    } catch (error) {
      this.logger.error(`Error in getBillingByExamination for ${examinationId}:`, error.stack);
      return { totalAmount: 0, paidAmount: 0, dueAmount: 0, installments: [], error: error.message };
    }
  }

  async addPayment(billingId: number, paymentData: { method: string; amount: number; notes?: string }): Promise<any> {
    try {
      this.logger.log(`Adding payment to billing ID ${billingId}: ${paymentData.amount}`);
      const billing = await this.billingRepository.findOne({ where: { id: billingId } });
      if (!billing) throw new Error('Billing record not found');

      const lastInstallment = await this.installmentRepository.findOne({
        where: { pharmacyBillingId: billingId },
        order: { installmentNumber: 'DESC' },
      });
      const nextNumber = (lastInstallment?.installmentNumber || 0) + 1;

      const installment = this.installmentRepository.create({
        pharmacyBillingId: billingId,
        installmentNumber: nextNumber,
        paymentMethod: paymentData.method,
        amount: paymentData.amount,
        notes: paymentData.notes,
      });
      await this.installmentRepository.save(installment);

      billing.paidAmount = parseFloat(billing.paidAmount as any) + parseFloat(paymentData.amount as any);
      billing.dueAmount = Math.max(0, parseFloat(billing.totalAmount as any) - billing.paidAmount);
      await this.billingRepository.save(billing);

      this.logger.log(`Payment added. New balance - Paid: ${billing.paidAmount}, Due: ${billing.dueAmount}`);
      return { message: 'Payment added successfully', billing };
    } catch (error) {
      this.logger.error(`Error in addPayment for billing ${billingId}:`, error.stack);
      throw error;
    }
  }

  async getDueList(locationId?: number, page: number = 1, limit: number = 10): Promise<any> {
    try {
      this.logger.log(`Fetching due list for location ${locationId}, Page ${page}`);
      const where: any = {
        dueAmount: MoreThan(0),
      };
      
      const [data, total] = await this.billingRepository.findAndCount({
        where,
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      }).catch(e => {
        this.logger.error(`Failed to fetch due list from DB: ${e.message}`);
        return [[], 0] as [PharmacyBilling[], number];
      });

      // Enhance with patient info
      const enhancedData = await Promise.all(data.map(async (b) => {
        try {
          const patient = await this.examinationRepository.manager.query(
            'SELECT first_name, last_name, patient_id as patient_code, mobile FROM patients WHERE id = $1',
            [b.patientId]
          );
          
          const exam = await this.examinationRepository.findOne({ 
            where: { id: b.examinationId },
            select: ['locationId', 'createdAt']
          });

          return { 
            ...b, 
            patient: patient[0] || { first_name: 'Unknown', last_name: 'Patient' },
            locationId: exam?.locationId,
            examDate: exam?.createdAt
          };
        } catch (e) {
          this.logger.error(`Failed to enhance billing ${b.id}: ${e.message}`);
          return { 
            ...b, 
            patient: { first_name: 'Error', last_name: 'Loading' },
            locationId: null,
            examDate: null
          };
        }

      }));

      // Filter by locationId if provided
      let filteredData = enhancedData;
      if (locationId) {
        filteredData = enhancedData.filter(d => d.locationId == locationId);
      }

      return {
        data: filteredData,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error in getDueList:', error.stack);
      return { data: [], total: 0, page, limit, totalPages: 0, error: error.message };
    }
  }
}



