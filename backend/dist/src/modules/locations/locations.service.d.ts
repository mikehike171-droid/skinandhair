import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
export declare class LocationsService {
    private locationRepository;
    constructor(locationRepository: Repository<Location>);
    findAll(): Promise<Location[]>;
    findByUserLocations(userLocationIds: number[]): Promise<Location[]>;
    findByUserLocation(userLocationId: number | null): Promise<Location[]>;
    findOne(id: string): Promise<Location>;
    create(locationData: Partial<Location>): Promise<Location>;
    update(id: number, locationData: Partial<Location>): Promise<Location>;
}
