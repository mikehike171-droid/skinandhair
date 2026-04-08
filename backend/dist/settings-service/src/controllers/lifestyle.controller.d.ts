import { LifestyleService } from '../services/lifestyle.service';
export declare class LifestyleController {
    private readonly lifestyleService;
    constructor(lifestyleService: LifestyleService);
    getLifestyle(): Promise<any>;
    getLifestyleOptions(id: string): Promise<any>;
    getPatientLifestyle(patientId: string, locationId: string, req: any): Promise<{
        data: any;
        notes: any;
    }>;
    savePatientLifestyle(data: any, req: any): Promise<{
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
    deletePatientLifestyle(data: any, req: any): Promise<{
        success: boolean;
    }>;
}
