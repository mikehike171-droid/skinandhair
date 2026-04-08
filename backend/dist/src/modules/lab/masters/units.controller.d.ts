import { UnitsService } from './units.service';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';
export declare class UnitsController {
    private readonly unitsService;
    constructor(unitsService: UnitsService);
    findAll(locationId?: string): Promise<import("./entities/unit.entity").Unit[]>;
    create(createUnitDto: CreateUnitDto): Promise<import("./entities/unit.entity").Unit>;
    update(id: string, updateUnitDto: UpdateUnitDto): Promise<import("./entities/unit.entity").Unit>;
    remove(id: string): Promise<void>;
}
