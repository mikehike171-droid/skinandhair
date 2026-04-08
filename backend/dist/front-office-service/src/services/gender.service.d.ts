import { Repository } from 'typeorm';
import { Gender } from '../entities/gender.entity';
export declare class GenderService {
    private genderRepository;
    constructor(genderRepository: Repository<Gender>);
    findAll(): Promise<Gender[]>;
}
