import { Repository, DataSource } from 'typeorm';
import { Patient } from './entities/patient.entity';
export declare class PatientsService {
    private patientRepository;
    private dataSource;
    constructor(patientRepository: Repository<Patient>, dataSource: DataSource);
    create(patientData: Partial<Patient>): Promise<Patient>;
    findAll(locationId: string, patientSourceId?: string, fromDate?: string, toDate?: string): Promise<Patient[]>;
    findOne(id: string): Promise<Patient>;
    update(id: string, updateData: Partial<Patient>): Promise<Patient>;
    remove(id: string): Promise<void>;
    private generatePatientId;
    registerPatient(registerData: any, locationId: string): Promise<any>;
    createConsultation(consultationData: any, locationId: string): Promise<any>;
    createBill(billData: any, locationId: string): Promise<any>;
}
