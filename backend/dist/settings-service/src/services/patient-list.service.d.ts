import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
export declare class PatientListService {
    private patientRepository;
    constructor(patientRepository: Repository<Patient>);
    getAllPatients(locationId?: number, fromDate?: string, toDate?: string, page?: number, limit?: number, search?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPatientById(patientId: string, locationId: number, userId?: string): Promise<Patient>;
    getPatientsBySource(locationId: number, patientSourceId: number, fromDate?: string, toDate?: string): Promise<Patient[]>;
    getRefPatients(locationId: number, page?: number, limit?: number): Promise<{
        data: Patient[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getEmployeeRefPatients(locationId: number, page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
