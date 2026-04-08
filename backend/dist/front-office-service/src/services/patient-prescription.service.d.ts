import { Repository } from 'typeorm';
import { PatientPrescription } from '../entities/patient-prescription.entity';
export declare class PatientPrescriptionService {
    private prescriptionRepository;
    constructor(prescriptionRepository: Repository<PatientPrescription>);
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
    }): Promise<PatientPrescription>;
    getPatientVitals(patientId: number): Promise<PatientPrescription[]>;
}
