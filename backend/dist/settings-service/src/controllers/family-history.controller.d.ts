import { FamilyHistoryService } from '../services/family-history.service';
export declare class FamilyHistoryController {
    private readonly familyHistoryService;
    constructor(familyHistoryService: FamilyHistoryService);
    getFamilyHistory(): Promise<any>;
    getFamilyHistoryOptions(id: string): Promise<any>;
    getPatientFamilyHistory(patientId: string, locationId: string, req: any): Promise<{
        data: any;
        notes: any;
    }>;
    savePatientFamilyHistory(data: any, req: any): Promise<{
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
    deletePatientFamilyHistory(data: any, req: any): Promise<{
        success: boolean;
    }>;
}
