import { PersonalHistoryService } from '../services/personal-history.service';
export declare class PersonalHistoryController {
    private readonly personalHistoryService;
    constructor(personalHistoryService: PersonalHistoryService);
    getPersonalHistory(): Promise<any>;
    createPersonalHistory(data: any): Promise<any>;
    updatePersonalHistory(id: string, data: any): Promise<any>;
    getPersonalHistoryOptions(id: string): Promise<any>;
    getPatientPersonalHistory(patientId: string, locationId: string, req: any): Promise<{
        data: any;
        notes: any;
    }>;
    savePatientPersonalHistory(data: any, req: any): Promise<{
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
    deletePatientPersonalHistory(data: any, req: any): Promise<{
        success: boolean;
    }>;
}
