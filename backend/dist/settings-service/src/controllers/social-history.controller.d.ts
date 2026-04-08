import { SocialHistoryService } from '../services/social-history.service';
export declare class SocialHistoryController {
    private readonly socialHistoryService;
    constructor(socialHistoryService: SocialHistoryService);
    getSocialHistory(): Promise<any>;
    getSocialHistoryOptions(id: string): Promise<any>;
    getPatientSocialHistory(patientId: string, locationId: string, req: any): Promise<{
        data: any;
        notes: any;
    }>;
    savePatientSocialHistory(data: any, req: any): Promise<{
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
    deletePatientSocialHistory(data: any, req: any): Promise<{
        success: boolean;
    }>;
}
