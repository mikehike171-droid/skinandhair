import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { Location } from '../entities/location.entity';
export declare class PatientRegistrationService {
    private patientRepository;
    private locationRepository;
    constructor(patientRepository: Repository<Patient>, locationRepository: Repository<Location>);
    registerPatient(patientData: any, locationId: number, createdBy: number): Promise<{
        message: string;
        patient: {
            id: number;
            patientId: string;
            name: string;
            status: string;
        };
    }>;
    updatePatient(patientId: string, patientData: any, locationId: number, updatedBy: number): Promise<{
        message: string;
        patient: {
            id: number;
            patientId: string;
            name: string;
            status: string;
        };
    }>;
}
