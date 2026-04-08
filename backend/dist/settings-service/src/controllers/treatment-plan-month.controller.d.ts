import { TreatmentPlanMonthService } from '../services/treatment-plan-month.service';
export declare class TreatmentPlanMonthController {
    private readonly treatmentPlanMonthService;
    constructor(treatmentPlanMonthService: TreatmentPlanMonthService);
    findAll(): Promise<import("../entities/treatment-plan-month.entity").TreatmentPlanMonth[]>;
}
