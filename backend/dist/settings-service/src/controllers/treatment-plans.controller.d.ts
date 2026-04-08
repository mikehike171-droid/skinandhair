import { TreatmentPlansService } from '../services/treatment-plans.service';
export declare class TreatmentPlansController {
    private readonly treatmentPlansService;
    constructor(treatmentPlansService: TreatmentPlansService);
    findAll(): Promise<import("../entities/treatment-plan.entity").TreatmentPlan[]>;
    findOne(id: string): Promise<import("../entities/treatment-plan.entity").TreatmentPlan>;
    create(createTreatmentPlanDto: any): Promise<import("../entities/treatment-plan.entity").TreatmentPlan[]>;
    update(id: string, updateTreatmentPlanDto: any): Promise<import("../entities/treatment-plan.entity").TreatmentPlan>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
