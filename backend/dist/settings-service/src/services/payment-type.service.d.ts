import { Repository } from 'typeorm';
import { PaymentType } from '../entities/payment-type.entity';
export declare class PaymentTypeService {
    private paymentTypeRepository;
    constructor(paymentTypeRepository: Repository<PaymentType>);
    findAll(): Promise<PaymentType[]>;
    findOne(id: number): Promise<PaymentType>;
    create(data: Partial<PaymentType>): Promise<PaymentType>;
    update(id: number, data: Partial<PaymentType>): Promise<PaymentType>;
    remove(id: number): Promise<void>;
}
