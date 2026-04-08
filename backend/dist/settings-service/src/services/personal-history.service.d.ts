export declare class PersonalHistoryService {
    private pool;
    constructor();
    getPersonalHistory(): Promise<any>;
    getPersonalHistoryOptions(historyId: number): Promise<any>;
    createPersonalHistory(data: any): Promise<any>;
    updatePersonalHistory(id: number, data: any): Promise<any>;
    savePatientPersonalHistory(data: any, user: any): Promise<{
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
    getPatientPersonalHistory(patientId: string, locationId: string, user: any): Promise<{
        data: any;
        notes: any;
    }>;
    deletePatientPersonalHistory(data: any, user: any): Promise<{
        success: boolean;
    }>;
}
