import { Repository } from 'typeorm';
import { FeeMasters } from '../entities/fee-masters.entity';
export declare class FeeMastersService {
    private feeMastersRepository;
    constructor(feeMastersRepository: Repository<FeeMasters>);
    findAll(): Promise<FeeMasters[]>;
}
