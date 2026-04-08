import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
export declare class PatientAuthController {
    private patientRepository;
    constructor(patientRepository: Repository<Patient>);
    login(loginData: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        token: string;
        patient: {
            id: number;
            patientId: string;
            firstName: string;
            lastName: string;
            name: string;
            email: string;
            mobile: string;
        };
    }>;
}
