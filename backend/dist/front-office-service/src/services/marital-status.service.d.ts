import { Repository } from 'typeorm';
import { MaritalStatus } from '../entities/marital-status.entity';
export declare class MaritalStatusService {
    private maritalStatusRepository;
    constructor(maritalStatusRepository: Repository<MaritalStatus>);
    findAll(): Promise<MaritalStatus[]>;
}
