import { PatientCategoryService } from '../services/patient-category.service';
export declare class PatientCategoryController {
    private readonly patientCategoryService;
    constructor(patientCategoryService: PatientCategoryService);
    findAll(): Promise<import("../entities/patient-category.entity").PatientCategory[]>;
}
