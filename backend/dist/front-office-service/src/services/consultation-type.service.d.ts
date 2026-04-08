import { Repository } from 'typeorm';
import { ConsultationType } from '../entities/consultation-type.entity';
export declare class ConsultationTypeService {
    private consultationTypeRepository;
    constructor(consultationTypeRepository: Repository<ConsultationType>);
    findAll(): Promise<ConsultationType[]>;
}
