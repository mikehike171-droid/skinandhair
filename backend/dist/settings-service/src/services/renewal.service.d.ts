import { Repository } from 'typeorm';
import { PatientExamination } from '../entities/patient-examination.entity';
export declare class RenewalService {
    private patientExaminationRepository;
    constructor(patientExaminationRepository: Repository<PatientExamination>);
    getRenewalPatients(locationId: number, fromDate?: string, toDate?: string): Promise<any>;
}
