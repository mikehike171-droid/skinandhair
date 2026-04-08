import { Repository } from 'typeorm';
import { HRPolicy } from '../entities/hr-policy.entity';
import { CreateHRPolicyDto, UpdateHRPolicyDto } from '../dto/hr-policy.dto';
export declare class HRPoliciesService {
    private readonly hrPolicyRepository;
    constructor(hrPolicyRepository: Repository<HRPolicy>);
    create(createDto: CreateHRPolicyDto): Promise<HRPolicy>;
    findAll(page?: number, limit?: number, search?: string): Promise<any>;
    findOne(id: number): Promise<HRPolicy>;
    update(id: number, updateDto: UpdateHRPolicyDto): Promise<HRPolicy>;
    remove(id: number): Promise<void>;
}
