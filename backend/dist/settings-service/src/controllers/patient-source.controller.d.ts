import { PatientSourceService } from '../services/patient-source.service';
export declare class PatientSourceController {
    private readonly patientSourceService;
    constructor(patientSourceService: PatientSourceService);
    findAll(): Promise<import("../entities/patient-source.entity").PatientSource[]>;
    create(data: any): Promise<import("../entities/patient-source.entity").PatientSource[]>;
    update(id: number, data: any): Promise<import("../entities/patient-source.entity").PatientSource>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
