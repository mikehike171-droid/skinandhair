import { ConsultationTypeService } from '../services/consultation-type.service';
export declare class ConsultationTypeController {
    private readonly consultationTypeService;
    constructor(consultationTypeService: ConsultationTypeService);
    findAll(): Promise<import("../entities/consultation-type.entity").ConsultationType[]>;
}
