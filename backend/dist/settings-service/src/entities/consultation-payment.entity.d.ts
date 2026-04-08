import { Consultation } from './consultation.entity';
export declare class ConsultationPayment {
    id: number;
    consultation_id: number;
    payment_type: string;
    amount: number;
    created_at: Date;
    consultation: Consultation;
}
