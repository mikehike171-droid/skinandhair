import { Repository } from 'typeorm';
import { PaymentInstallment } from '../entities/payment-installment.entity';
export declare class TodayCollectionsService {
    private paymentInstallmentRepository;
    constructor(paymentInstallmentRepository: Repository<PaymentInstallment>);
    getTodayCollections(locationId?: number, fromDate?: string, toDate?: string): Promise<any[]>;
}
