import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class MedicalHistoryService {
    private userRepository;
    private pool;
    constructor(userRepository: Repository<User>);
    private ensureTable;
    private ensureMedicalHistoryTable;
    private ensureMedicalHistoryOptionsTable;
    private ensurePersonalHistoryTable;
    private ensurePersonalHistoryOptionsTable;
    private ensureLifestyleTable;
    private ensureLifestyleOptionsTable;
    private ensureFamilyHistoryTable;
    private ensureFamilyHistoryOptionsTable;
    private ensureDrugHistoryTable;
    private ensureDrugHistoryOptionsTable;
    private ensureAllergiesTable;
    private ensureAllergiesOptionsTable;
    private ensureSocialHistoryTable;
    private ensureSocialHistoryOptionsTable;
    private ensureMedicationTypeTable;
    private ensureMedicineTable;
    private ensurePotencyTable;
    private ensureDosageTable;
    getUserLocationId(userId: number): Promise<number>;
    getMedicalHistory(): Promise<any>;
    createMedicalHistory(data: any): Promise<any>;
    updateMedicalHistory(id: number, data: any): Promise<any>;
    deleteMedicalHistory(id: number): Promise<{
        success: boolean;
    }>;
    getMedicalHistoryOptions(historyId: number): Promise<any>;
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
    getPersonalHistoryOptions(historyId: number): Promise<any>;
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
    getLifestyleOptions(lifestyleId: number): Promise<any>;
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
    getFamilyHistoryOptions(familyHistoryId: number): Promise<any>;
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
    getDrugHistoryOptions(drugHistoryId: number): Promise<any>;
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
    getAllergiesOptions(allergyId: number): Promise<any>;
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
    getSocialHistoryOptions(socialHistoryId: number): Promise<any>;
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
    getPharmacyPrescriptions(locationId?: number): Promise<any>;
    updatePrescriptionStatus(prescriptionId: number, status: number): Promise<any>;
    getPatientExaminations(locationId?: number, page?: number, limit?: number, fromDate?: string, toDate?: string, search?: string): Promise<{
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
    savePatientMedicalHistory(data: any, user: any): Promise<{
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
    getPatientMedicalHistory(patientId: string, user: any): Promise<{
        data: any;
        notes: any;
    }>;
    deletePatientMedicalHistory(data: any, user: any): Promise<{
        success: boolean;
    }>;
}
