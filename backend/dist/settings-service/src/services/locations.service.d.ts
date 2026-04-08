import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
export declare class LocationsService {
    private locationRepository;
    constructor(locationRepository: Repository<Location>);
    findAll(): Promise<Location[]>;
    All(): Promise<Location[]>;
    getUserAccessibleLocations(userLocationId?: string): Promise<Location[]>;
    findOne(id: number): Promise<Location>;
    create(locationData: Partial<Location>): Promise<Location>;
    update(id: number, locationData: Partial<Location>): Promise<Location>;
    remove(id: number): Promise<Location>;
}
