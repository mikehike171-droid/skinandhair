import { QueueService } from '../services/queue.service';
import { CreateQueueTokenDto } from '../dto/create-queue-token.dto';
export declare class QueueController {
    private readonly queueService;
    constructor(queueService: QueueService);
    createToken(createQueueTokenDto: CreateQueueTokenDto): Promise<import("../entities/patient-queue.entity").PatientQueue>;
    findAll(locationId: number, status?: string): Promise<import("../entities/patient-queue.entity").PatientQueue[]>;
    findOne(id: number): Promise<import("../entities/patient-queue.entity").PatientQueue>;
    callNext(locationId: number, department?: string): Promise<import("../entities/patient-queue.entity").PatientQueue>;
    updateStatus(id: number, status: string): Promise<import("../entities/patient-queue.entity").PatientQueue>;
    getStats(locationId: number): Promise<any>;
}
