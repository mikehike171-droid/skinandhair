import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    create(createPatientDto: Partial<Patient>): Promise<Patient>;
    findAll(locationId: string, patientSourceId?: string, fromDate?: string, toDate?: string): Promise<Patient[]>;
    findOne(id: string): Promise<Patient>;
    update(id: string, updatePatientDto: Partial<Patient>): Promise<Patient>;
    remove(id: string): Promise<void>;
    register(registerData: any, locationId: string): Promise<any>;
    createConsultation(consultationData: any, locationId: string): Promise<any>;
    createBill(billData: any, locationId: string): Promise<any>;
}
