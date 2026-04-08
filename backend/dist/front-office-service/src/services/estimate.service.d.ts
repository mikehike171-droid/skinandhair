import { Repository } from 'typeorm';
import { Estimate } from '../entities/estimate.entity';
import { EstimateItem } from '../entities/estimate-item.entity';
import { CreateEstimateDto } from '../dto/create-estimate.dto';
import { MicroserviceClientService } from './microservice-client.service';
export declare class EstimateService {
    private estimateRepository;
    private estimateItemRepository;
    private microserviceClient;
    constructor(estimateRepository: Repository<Estimate>, estimateItemRepository: Repository<EstimateItem>, microserviceClient: MicroserviceClientService);
    create(createEstimateDto: CreateEstimateDto): Promise<Estimate>;
    findAll(locationId: number): Promise<Estimate[]>;
    findOne(id: number): Promise<Estimate>;
    updateStatus(id: number, status: string): Promise<Estimate>;
    convertToBill(id: number, userId: number): Promise<any>;
    private generateEstimateNumber;
}
