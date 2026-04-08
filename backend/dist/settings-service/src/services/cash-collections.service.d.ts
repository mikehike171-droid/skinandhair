import { Repository } from 'typeorm';
import { PaymentInstallment } from '../entities/payment-installment.entity';
export declare class CashCollectionsService {
    private paymentInstallmentRepository;
    constructor(paymentInstallmentRepository: Repository<PaymentInstallment>);
    getCashCollections(locationId?: number, page?: number, limit?: number, fromDate?: string, toDate?: string): Promise<{
        data: {
            date: any;
            credit: any;
            debit: any;
            balance: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
        summary: {
            totalCash: any;
            totalExpenses: any;
            currentBalance: number;
        };
    }>;
}
