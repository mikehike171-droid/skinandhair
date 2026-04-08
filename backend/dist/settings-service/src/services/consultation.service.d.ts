import { Repository, DataSource } from 'typeorm';
import { Consultation } from '../entities/consultation.entity';
import { ConsultationPayment } from '../entities/consultation-payment.entity';
export declare class ConsultationService {
    private consultationRepository;
    private consultationPaymentRepository;
    private dataSource;
    constructor(consultationRepository: Repository<Consultation>, consultationPaymentRepository: Repository<ConsultationPayment>, dataSource: DataSource);
    private ensureTablesExist;
    recordConsultation(consultationData: any, locationId: number): Promise<{
        message: string;
        consultation: {
            id: number;
            consultationId: string;
            fee: number;
            payments: any;
        };
    }>;
}
