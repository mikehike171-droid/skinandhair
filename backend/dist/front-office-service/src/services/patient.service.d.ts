import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { MicroserviceClientService } from './microservice-client.service';
export declare class PatientService implements OnModuleInit {
    private patientRepository;
    private microserviceClient;
    constructor(patientRepository: Repository<Patient>, microserviceClient: MicroserviceClientService);
    onModuleInit(): Promise<void>;
    private generateMissingPatientIds;
    private generatePatientId;
    findAll(): Promise<Patient[]>;
    findOne(id: number): Promise<Patient>;
    searchPatients(query: string): Promise<any[]>;
    private calculateAge;
    getPatientHistory(patientId: number): Promise<any>;
    create(patientData: Partial<Patient>): Promise<Patient>;
    update(id: number, patientData: Partial<Patient>): Promise<Patient>;
    getPatientStats(): Promise<any>;
}
