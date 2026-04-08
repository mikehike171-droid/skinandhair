import { Repository } from 'typeorm';
import { VisitType } from '../entities/visit-type.entity';
export declare class VisitTypeService {
    private visitTypeRepository;
    constructor(visitTypeRepository: Repository<VisitType>);
    findAll(): Promise<VisitType[]>;
}
