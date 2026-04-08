import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../auth/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';
export declare enum AppointmentStatus {
    SCHEDULED = "scheduled",
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    NO_SHOW = "no_show"
}
export declare enum AppointmentType {
    CONSULTATION = "consultation",
    FOLLOW_UP = "follow_up",
    EMERGENCY = "emergency",
    ROUTINE_CHECKUP = "routine_checkup"
}
export declare class Appointment {
    id: number;
    appointmentNumber: string;
    location: Location;
    locationId: number;
    patient: Patient;
    patientId: number;
    doctor: User;
    doctorId: number;
    appointmentDate: Date;
    type: AppointmentType;
    status: AppointmentStatus;
    reason: string;
    notes: string;
    consultationFee: number;
    createdAt: Date;
    updatedAt: Date;
}
