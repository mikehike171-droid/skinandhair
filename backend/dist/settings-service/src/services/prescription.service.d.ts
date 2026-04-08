import { DataSource } from 'typeorm';
import { UserLocationService } from './user-location.service';
export declare class PrescriptionService {
    private readonly userLocationService;
    private dataSource;
    constructor(userLocationService: UserLocationService, dataSource: DataSource);
    savePatientPrescriptions(data: any, user: any): Promise<{
        success: boolean;
        prescriptionId: number;
        medicineId: number;
        medicineIds?: undefined;
    } | {
        success: boolean;
        prescriptionId: any;
        medicineIds: any[];
        medicineId?: undefined;
    }>;
    private createTablesIfNotExist;
    getPatientPrescriptions(patientId: string, user: any): Promise<any>;
    deletePatientPrescription(id: number, user: any): Promise<{
        success: boolean;
    }>;
}
