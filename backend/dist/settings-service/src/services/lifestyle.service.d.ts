export declare class LifestyleService {
    private pool;
    constructor();
    getLifestyle(): Promise<any>;
    getLifestyleOptions(lifestyleId: number): Promise<any>;
    savePatientLifestyle(data: any, user: any): Promise<{
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
    getPatientLifestyle(patientId: string, locationId: string, user: any): Promise<{
        data: any;
        notes: any;
    }>;
    deletePatientLifestyle(data: any, user: any): Promise<{
        success: boolean;
    }>;
}
