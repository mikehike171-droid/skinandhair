import { MedicalHistoryService } from '../services/medical-history.service';
export declare class MedicalHistoryController {
    private readonly medicalHistoryService;
    constructor(medicalHistoryService: MedicalHistoryService);
    getMedicalHistory(): Promise<any>;
    createMedicalHistory(data: any): Promise<any>;
    updateMedicalHistory(id: number, data: any): Promise<any>;
    deleteMedicalHistory(id: number): Promise<{
        success: boolean;
    }>;
    getMedicalHistoryOptions(id: string): Promise<any>;
    createMedicalHistoryOption(data: any): Promise<any>;
    updateMedicalHistoryOption(id: number, data: any): Promise<any>;
    deleteMedicalHistoryOption(id: number): Promise<{
        success: boolean;
    }>;
    getAllMedicalHistoryOptions(): Promise<any>;
    getPersonalHistory(): Promise<any>;
    createPersonalHistory(data: any): Promise<any>;
    updatePersonalHistory(id: number, data: any): Promise<any>;
    deletePersonalHistory(id: number): Promise<{
        success: boolean;
    }>;
    getPersonalHistoryOptions(id: string): Promise<any>;
    createPersonalHistoryOption(data: any): Promise<any>;
    updatePersonalHistoryOption(id: number, data: any): Promise<any>;
    deletePersonalHistoryOption(id: number): Promise<{
        success: boolean;
    }>;
    getAllPersonalHistoryOptions(): Promise<any>;
    getLifestyle(): Promise<any>;
    createLifestyle(data: any): Promise<any>;
    updateLifestyle(id: number, data: any): Promise<any>;
    deleteLifestyle(id: number): Promise<{
        success: boolean;
    }>;
    getLifestyleOptions(id: string): Promise<any>;
    createLifestyleOption(data: any): Promise<any>;
    updateLifestyleOption(id: number, data: any): Promise<any>;
    deleteLifestyleOption(id: number): Promise<{
        success: boolean;
    }>;
    getAllLifestyleOptions(): Promise<any>;
    getFamilyHistory(): Promise<any>;
    createFamilyHistory(data: any): Promise<any>;
    updateFamilyHistory(id: number, data: any): Promise<any>;
    deleteFamilyHistory(id: number): Promise<{
        success: boolean;
    }>;
    getFamilyHistoryOptions(id: string): Promise<any>;
    createFamilyHistoryOption(data: any): Promise<any>;
    updateFamilyHistoryOption(id: number, data: any): Promise<any>;
    deleteFamilyHistoryOption(id: number): Promise<{
        success: boolean;
    }>;
    getAllFamilyHistoryOptions(): Promise<any>;
    getDrugHistory(): Promise<any>;
    createDrugHistory(data: any): Promise<any>;
    updateDrugHistory(id: number, data: any): Promise<any>;
    deleteDrugHistory(id: number): Promise<{
        success: boolean;
    }>;
    getDrugHistoryOptions(id: string): Promise<any>;
    createDrugHistoryOption(data: any): Promise<any>;
    updateDrugHistoryOption(id: number, data: any): Promise<any>;
    deleteDrugHistoryOption(id: number): Promise<{
        success: boolean;
    }>;
    getAllDrugHistoryOptions(): Promise<any>;
    getAllergies(): Promise<any>;
    createAllergy(data: any): Promise<any>;
    updateAllergy(id: number, data: any): Promise<any>;
    deleteAllergy(id: number): Promise<{
        success: boolean;
    }>;
    getAllergiesOptions(id: string): Promise<any>;
    createAllergyOption(data: any): Promise<any>;
    updateAllergyOption(id: number, data: any): Promise<any>;
    deleteAllergyOption(id: number): Promise<{
        success: boolean;
    }>;
    getAllAllergiesOptions(): Promise<any>;
    getSocialHistory(): Promise<any>;
    createSocialHistory(data: any): Promise<any>;
    updateSocialHistory(id: number, data: any): Promise<any>;
    deleteSocialHistory(id: number): Promise<{
        success: boolean;
    }>;
    getSocialHistoryOptions(id: string): Promise<any>;
    createSocialHistoryOption(data: any): Promise<any>;
    updateSocialHistoryOption(id: number, data: any): Promise<any>;
    deleteSocialHistoryOption(id: number): Promise<{
        success: boolean;
    }>;
    getAllSocialHistoryOptions(): Promise<any>;
    getMedicationType(): Promise<any>;
    createMedicationType(data: any): Promise<any>;
    updateMedicationType(id: number, data: any): Promise<any>;
    deleteMedicationType(id: number): Promise<{
        success: boolean;
    }>;
    getMedicine(): Promise<any>;
    createMedicine(data: any): Promise<any>;
    updateMedicine(id: number, data: any): Promise<any>;
    deleteMedicine(id: number): Promise<{
        success: boolean;
    }>;
    getPotency(): Promise<any>;
    createPotency(data: any): Promise<any>;
    updatePotency(id: number, data: any): Promise<any>;
    deletePotency(id: number): Promise<{
        success: boolean;
    }>;
    getDosage(): Promise<any>;
    createDosage(data: any): Promise<any>;
    updateDosage(id: number, data: any): Promise<any>;
    deleteDosage(id: number): Promise<{
        success: boolean;
    }>;
    getPharmacyPrescriptions(): Promise<any>;
    updatePrescriptionStatus(id: number, data: {
        status: number;
    }): Promise<any>;
    getPatientExaminations(page?: string, limit?: string, fromDate?: string, toDate?: string, search?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getPatientMedicalHistory(patientId: string, req: any): Promise<{
        data: any;
        notes: any;
    }>;
    savePatientMedicalHistory(data: any, req: any): Promise<{
        success: boolean;
        message?: undefined;
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
    deletePatientMedicalHistory(data: any, req: any): Promise<{
        success: boolean;
    }>;
}
