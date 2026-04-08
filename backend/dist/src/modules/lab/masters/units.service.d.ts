import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';
export declare class UnitsService {
    private unitsRepository;
    constructor(unitsRepository: Repository<Unit>);
    findAll(locationId?: number): Promise<Unit[]>;
    create(createUnitDto: CreateUnitDto): Promise<Unit>;
    update(id: number, updateUnitDto: UpdateUnitDto): Promise<Unit>;
    remove(id: number): Promise<void>;
}
