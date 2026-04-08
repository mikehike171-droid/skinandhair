import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
export declare class LocationsService {
    private locationRepository;
    constructor(locationRepository: Repository<Location>);
    findAll(): Promise<Location[]>;
}
