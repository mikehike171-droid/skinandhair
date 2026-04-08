export declare class AllergiesService {
    private pool;
    constructor();
    getAllergies(): Promise<any>;
    getAllergiesOptions(allergiesId: number): Promise<any>;
    savePatientAllergies(data: any, user: any): Promise<{
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
    getPatientAllergies(patientId: string, locationId: string, user: any): Promise<{
        data: any;
        notes: any;
    }>;
    deletePatientAllergies(data: any, user: any): Promise<{
        success: boolean;
    }>;
}
