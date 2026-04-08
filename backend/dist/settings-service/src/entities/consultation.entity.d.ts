import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';
export declare class Consultation {
    id: number;
    consultation_id: string;
    patient_id: number;
    doctor_id: number;
    consultation_fee: number;
    location_id: number;
    created_at: Date;
    updated_at: Date;
    patient: Patient;
    doctor: Doctor;
}
