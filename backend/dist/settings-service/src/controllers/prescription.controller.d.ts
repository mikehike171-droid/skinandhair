import { PrescriptionService } from '../services/prescription.service';
import { UserLocationService } from '../services/user-location.service';
export declare class PrescriptionController {
    private readonly prescriptionService;
    private readonly userLocationService;
    constructor(prescriptionService: PrescriptionService, userLocationService: UserLocationService);
    getPatientPrescriptions(patientId: string, req: any): Promise<any>;
    savePatientPrescriptions(data: any, req: any): Promise<{
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
    deletePatientPrescription(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
