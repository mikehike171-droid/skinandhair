import { PatientPrescriptionService } from '../services/patient-prescription.service';
export declare class PatientPrescriptionController {
    private readonly prescriptionService;
    constructor(prescriptionService: PatientPrescriptionService);
    createVitals(vitalsData: {
        patientId: number;
        vitalsTemperature?: number;
        vitalsBloodPressure?: string;
        vitalsHeartRate?: number;
        vitalsO2Saturation?: number;
        vitalsRespiratoryRate?: number;
        vitalsWeight?: number;
        vitalsHeight?: number;
        vitalsBloodGlucose?: number;
        vitalsPainScale?: number;
        nursingNotes?: string;
    }): Promise<import("../entities/patient-prescription.entity").PatientPrescription>;
    getPatientVitals(patientId: number): Promise<import("../entities/patient-prescription.entity").PatientPrescription[]>;
}
