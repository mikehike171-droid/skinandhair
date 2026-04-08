import { PatientService } from '../services/patient.service';
export declare class PatientController {
    private readonly patientService;
    constructor(patientService: PatientService);
    findAll(): Promise<import("../entities/patient.entity").Patient[]>;
    searchPatients(query: string): Promise<any[]>;
    searchPatientsPost(body: {
        query: string;
    }): Promise<any[]>;
    getStats(): Promise<any>;
    findOne(id: number): Promise<import("../entities/patient.entity").Patient>;
    getHistory(id: number): Promise<any>;
}
