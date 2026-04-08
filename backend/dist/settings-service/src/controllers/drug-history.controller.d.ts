import { DrugHistoryService } from '../services/drug-history.service';
export declare class DrugHistoryController {
    private readonly drugHistoryService;
    constructor(drugHistoryService: DrugHistoryService);
    getDrugHistory(): Promise<any>;
    getDrugHistoryOptions(id: string): Promise<any>;
    getPatientDrugHistory(patientId: string, locationId: string, req: any): Promise<{
        data: any;
        notes: any;
    }>;
    savePatientDrugHistory(data: any, req: any): Promise<{
        success: boolean;
        message: string;
        id?: undefined;
    } | {
        message: string;
        success?: undefined;
        id?: undefined;
    } | {
        success: boolean;
        id: any;
        message?: undefined;
    }>;
    deletePatientDrugHistory(data: any, req: any): Promise<{
        success: boolean;
    }>;
}
