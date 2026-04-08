import { LocationsService } from './locations.service';
import { Location } from './entities/location.entity';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    findAll(): Promise<Location[]>;
    getUserBranches(req: any): Promise<Location[]>;
    findOne(id: string): Promise<Location>;
    create(createLocationDto: Partial<Location>): Promise<Location>;
    update(id: string, updateLocationDto: Partial<Location>): Promise<Location>;
}
