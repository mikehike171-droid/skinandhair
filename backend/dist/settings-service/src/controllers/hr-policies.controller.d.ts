import { HRPoliciesService } from '../services/hr-policies.service';
import { CreateHRPolicyDto, UpdateHRPolicyDto } from '../dto/hr-policy.dto';
export declare class HRPoliciesController {
    private readonly hrPoliciesService;
    constructor(hrPoliciesService: HRPoliciesService);
    create(createDto: CreateHRPolicyDto): Promise<import("../entities/hr-policy.entity").HRPolicy>;
    findAll(page?: string, limit?: string, search?: string): Promise<any>;
    findOne(id: string): Promise<import("../entities/hr-policy.entity").HRPolicy>;
    update(id: string, updateDto: UpdateHRPolicyDto): Promise<import("../entities/hr-policy.entity").HRPolicy>;
    remove(id: string): Promise<void>;
}
