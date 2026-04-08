import { InvestigationsService } from './investigations.service';
import { CreateInvestigationDto, UpdateInvestigationDto } from './dto/investigation.dto';
export declare class InvestigationsController {
    private readonly investigationsService;
    constructor(investigationsService: InvestigationsService);
    findAll(locationId?: string): Promise<import("./entities/investigation.entity").Investigation[]>;
    create(createInvestigationDto: CreateInvestigationDto): Promise<import("./entities/investigation.entity").Investigation>;
    update(id: string, updateInvestigationDto: UpdateInvestigationDto): Promise<import("./entities/investigation.entity").Investigation>;
    remove(id: string): Promise<void>;
}
