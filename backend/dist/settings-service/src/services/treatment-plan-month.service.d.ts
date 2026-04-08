import { Repository } from 'typeorm';
import { TreatmentPlanMonth } from '../entities/treatment-plan-month.entity';
export declare class TreatmentPlanMonthService {
    private treatmentPlanMonthRepository;
    constructor(treatmentPlanMonthRepository: Repository<TreatmentPlanMonth>);
    findAll(): Promise<TreatmentPlanMonth[]>;
}
