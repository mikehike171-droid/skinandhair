import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../auth/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';
export declare class Medicine {
    id: number;
    medicineCode: string;
    location: Location;
    locationId: number;
    name: string;
    genericName: string;
    manufacturer: string;
    category: string;
    unitPrice: number;
    stockQuantity: number;
    minStockLevel: number;
    expiryDate: Date;
    batchNumber: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum PrescriptionStatus {
    PENDING = "pending",
    DISPENSED = "dispensed",
    PARTIALLY_DISPENSED = "partially_dispensed",
    CANCELLED = "cancelled"
}
export declare class Prescription {
    id: number;
    prescriptionNumber: string;
    location: Location;
    locationId: number;
    patient: Patient;
    patientId: number;
    doctor: User;
    doctorId: number;
    status: PrescriptionStatus;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PrescriptionItem {
    id: number;
    prescription: Prescription;
    prescriptionId: number;
    medicine: Medicine;
    medicineId: number;
    quantity: number;
    dosage: string;
    frequency: string;
    duration: number;
    instructions: string;
}
