import { Repository } from 'typeorm';
import { PatientQueue } from '../entities/patient-queue.entity';
import { CreateQueueTokenDto } from '../dto/create-queue-token.dto';
import { MicroserviceClientService } from './microservice-client.service';
export declare class QueueService {
    private queueRepository;
    private microserviceClient;
    constructor(queueRepository: Repository<PatientQueue>, microserviceClient: MicroserviceClientService);
    createToken(createQueueTokenDto: CreateQueueTokenDto): Promise<PatientQueue>;
    findAll(locationId: number, status?: string): Promise<PatientQueue[]>;
    findOne(id: number): Promise<PatientQueue>;
    callNext(locationId: number, department?: string): Promise<PatientQueue>;
    updateStatus(id: number, status: string): Promise<PatientQueue>;
    getQueueStats(locationId: number): Promise<any>;
    private generateQueueNumber;
    private calculateWaitTime;
    private getAverageWaitTime;
}
