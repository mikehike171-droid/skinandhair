import { GenderService } from '../services/gender.service';
export declare class GenderController {
    private readonly genderService;
    constructor(genderService: GenderService);
    findAll(): Promise<import("../entities/gender.entity").Gender[]>;
}
