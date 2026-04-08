export declare class SocialHistoryService {
    private pool;
    constructor();
    getSocialHistory(): Promise<any>;
    getSocialHistoryOptions(socialHistoryId: number): Promise<any>;
    savePatientSocialHistory(data: any, user: any): Promise<{
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
    getPatientSocialHistory(patientId: string, locationId: string, user: any): Promise<{
        data: any;
        notes: any;
    }>;
    deletePatientSocialHistory(data: any, user: any): Promise<{
        success: boolean;
    }>;
}
