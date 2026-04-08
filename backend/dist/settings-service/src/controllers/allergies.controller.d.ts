import { AllergiesService } from '../services/allergies.service';
export declare class AllergiesController {
    private readonly allergiesService;
    constructor(allergiesService: AllergiesService);
    getAllergies(): Promise<any>;
    getPatientAllergies(patientId: string, locationId: string, req: any): Promise<{
        data: any;
        notes: any;
    }>;
    savePatientAllergies(data: any, req: any): Promise<{
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
    deletePatientAllergies(data: any, req: any): Promise<{
        success: boolean;
    }>;
}
