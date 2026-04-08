import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
export declare class LocationsIpService {
    private locationRepository;
    constructor(locationRepository: Repository<Location>);
    findAll(): Promise<any>;
    create(data: any): Promise<any>;
    update(id: number, data: any): Promise<any>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
