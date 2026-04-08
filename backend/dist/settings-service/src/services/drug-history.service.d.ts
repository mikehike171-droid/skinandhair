export declare class DrugHistoryService {
    private pool;
    constructor();
    getDrugHistory(): Promise<any>;
    getDrugHistoryOptions(historyId: number): Promise<any>;
    savePatientDrugHistory(data: any, user: any): Promise<{
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
    getPatientDrugHistory(patientId: string, locationId: string, user: any): Promise<{
        data: any;
        notes: any;
    }>;
    deletePatientDrugHistory(data: any, user: any): Promise<{
        success: boolean;
    }>;
}
