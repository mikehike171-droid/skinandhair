import { PaymentTypeService } from '../services/payment-type.service';
import { PaymentType } from '../entities/payment-type.entity';
export declare class PaymentTypeController {
    private readonly paymentTypeService;
    constructor(paymentTypeService: PaymentTypeService);
    findAll(): Promise<PaymentType[]>;
    findOne(id: string): Promise<PaymentType>;
    create(data: Partial<PaymentType>): Promise<PaymentType>;
    update(id: string, data: Partial<PaymentType>): Promise<PaymentType>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
