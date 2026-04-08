import { FeeMastersService } from '../services/fee-masters.service';
export declare class FeeMastersController {
    private readonly feeMastersService;
    constructor(feeMastersService: FeeMastersService);
    findAll(): Promise<import("../entities/fee-masters.entity").FeeMasters[]>;
}
