import { TelecallerService } from '../services/telecaller.service';
export declare class TelecallerController {
    private readonly telecallerService;
    constructor(telecallerService: TelecallerService);
    getPatientCallHistory(patientId: string, req: any, locationId?: string): Promise<{
        sno: number;
        dateTime: string;
        nextCallDate: string;
        disposition: string;
        callerName: any;
        patientFeeling: string;
        notes: string;
    }[]>;
    addCallRecord(patientId: string, callData: any, req: any, locationId?: string): Promise<{
        success: boolean;
        message: string;
        data: import("../entities/call-history.entity").CallHistory;
    }>;
}
