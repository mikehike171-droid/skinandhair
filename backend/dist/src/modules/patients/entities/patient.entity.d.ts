import { Location } from '../../locations/entities/location.entity';
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare enum BloodGroup {
    A_POSITIVE = "A+",
    A_NEGATIVE = "A-",
    B_POSITIVE = "B+",
    B_NEGATIVE = "B-",
    AB_POSITIVE = "AB+",
    AB_NEGATIVE = "AB-",
    O_POSITIVE = "O+",
    O_NEGATIVE = "O-"
}
export declare class Patient {
    id: number;
    patientId: string;
    location: Location;
    locationId: number;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: Gender;
    phone: string;
    email: string;
    address: string;
    emergencyContact: string;
    bloodGroup: BloodGroup;
    allergies: string;
    medicalHistory: string;
    insuranceNumber: string;
    isActive: boolean;
    password: string;
    patientSourceId: number;
    createdAt: Date;
    updatedAt: Date;
}
