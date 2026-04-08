import { ConsultationService } from '../services/consultation.service';
export declare class ConsultationController {
    private readonly consultationService;
    constructor(consultationService: ConsultationService);
    recordConsultation(req: any, consultationData: any): Promise<{
        message: string;
        consultation: {
            id: number;
            consultationId: string;
            fee: number;
            payments: any;
        };
    }>;
}
