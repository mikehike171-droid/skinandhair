import { MaritalStatusService } from '../services/marital-status.service';
export declare class MaritalStatusController {
    private readonly maritalStatusService;
    constructor(maritalStatusService: MaritalStatusService);
    findAll(): Promise<import("../entities/marital-status.entity").MaritalStatus[]>;
}
