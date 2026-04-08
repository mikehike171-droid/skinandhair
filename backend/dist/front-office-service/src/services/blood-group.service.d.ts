import { Repository } from 'typeorm';
import { BloodGroup } from '../entities/blood-group.entity';
export declare class BloodGroupService {
    private bloodGroupRepository;
    constructor(bloodGroupRepository: Repository<BloodGroup>);
    findAll(): Promise<BloodGroup[]>;
}
