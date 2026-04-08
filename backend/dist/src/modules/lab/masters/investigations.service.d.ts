import { Repository } from 'typeorm';
import { Investigation } from './entities/investigation.entity';
import { CreateInvestigationDto, UpdateInvestigationDto } from './dto/investigation.dto';
export declare class InvestigationsService {
    private investigationsRepository;
    constructor(investigationsRepository: Repository<Investigation>);
    findAll(locationId?: number): Promise<Investigation[]>;
    create(createInvestigationDto: CreateInvestigationDto): Promise<Investigation>;
    update(id: number, updateInvestigationDto: UpdateInvestigationDto): Promise<Investigation>;
    remove(id: number): Promise<void>;
}
