import { Repository } from 'typeorm';
import { TreatmentPlan } from '../entities/treatment-plan.entity';
export declare class TreatmentPlansService {
    private treatmentPlanRepository;
    constructor(treatmentPlanRepository: Repository<TreatmentPlan>);
    findAll(): Promise<TreatmentPlan[]>;
    findOne(id: number): Promise<TreatmentPlan>;
    create(createTreatmentPlanDto: any): Promise<TreatmentPlan[]>;
    update(id: number, updateTreatmentPlanDto: any): Promise<TreatmentPlan>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
