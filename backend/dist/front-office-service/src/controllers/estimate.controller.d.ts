import { EstimateService } from '../services/estimate.service';
import { CreateEstimateDto } from '../dto/create-estimate.dto';
export declare class EstimateController {
    private readonly estimateService;
    constructor(estimateService: EstimateService);
    create(createEstimateDto: CreateEstimateDto): Promise<import("../entities/estimate.entity").Estimate>;
    findAll(locationId: number): Promise<import("../entities/estimate.entity").Estimate[]>;
    findOne(id: number): Promise<import("../entities/estimate.entity").Estimate>;
    updateStatus(id: number, status: string): Promise<import("../entities/estimate.entity").Estimate>;
    convertToBill(id: number, userId: number): Promise<any>;
}
