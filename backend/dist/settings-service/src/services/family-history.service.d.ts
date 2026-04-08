export declare class FamilyHistoryService {
    private pool;
    constructor();
    getFamilyHistory(): Promise<any>;
    getFamilyHistoryOptions(familyHistoryId: number): Promise<any>;
    savePatientFamilyHistory(data: any, user: any): Promise<{
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
    getPatientFamilyHistory(patientId: string, locationId: string, user: any): Promise<{
        data: any;
        notes: any;
    }>;
    deletePatientFamilyHistory(data: any, user: any): Promise<{
        success: boolean;
    }>;
}
