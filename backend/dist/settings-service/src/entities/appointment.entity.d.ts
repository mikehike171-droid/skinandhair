import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';
import { AppointmentType } from './appointment-type.entity';
export declare class Appointment {
    id: number;
    appointment_id: string;
    patient_id: number;
    doctor_id: number;
    appointment_date: string;
    appointment_time: string;
    notes: string;
    check_for_srdoc_visit: boolean;
    appointment_type: string;
    appointment_type_id: number;
    status: string;
    location_id: number;
    created_at: Date;
    updated_at: Date;
    patient: Patient;
    doctor: Doctor;
    appointmentType: AppointmentType;
}
