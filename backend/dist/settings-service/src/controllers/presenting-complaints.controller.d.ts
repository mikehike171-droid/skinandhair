import { PresentingComplaintsService } from '../services/presenting-complaints.service';
export declare class PresentingComplaintsController {
    private readonly presentingComplaintsService;
    constructor(presentingComplaintsService: PresentingComplaintsService);
    savePatientPresentingComplaints(data: any, req: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getPatientPresentingComplaints(patientId: string): Promise<any>;
    deletePatientPresentingComplaint(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
