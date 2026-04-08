import { Repository } from 'typeorm';
import { PatientSource } from '../entities/patient-source.entity';
export declare class PatientSourceService {
    private patientSourceRepository;
    constructor(patientSourceRepository: Repository<PatientSource>);
    findAll(): Promise<PatientSource[]>;
    create(data: any): Promise<PatientSource[]>;
    update(id: number, data: any): Promise<PatientSource>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
