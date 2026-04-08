import { Repository } from 'typeorm';
import { PatientCategory } from '../entities/patient-category.entity';
export declare class PatientCategoryService {
    private patientCategoryRepository;
    constructor(patientCategoryRepository: Repository<PatientCategory>);
    findAll(): Promise<PatientCategory[]>;
}
