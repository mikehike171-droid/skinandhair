import { VisitTypeService } from '../services/visit-type.service';
export declare class VisitTypeController {
    private readonly visitTypeService;
    constructor(visitTypeService: VisitTypeService);
    findAll(): Promise<import("../entities/visit-type.entity").VisitType[]>;
}
