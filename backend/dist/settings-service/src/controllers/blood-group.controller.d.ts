import { BloodGroupService } from '../services/blood-group.service';
export declare class BloodGroupController {
    private readonly bloodGroupService;
    constructor(bloodGroupService: BloodGroupService);
    findAll(): Promise<import("../entities/blood-group.entity").BloodGroup[]>;
}
