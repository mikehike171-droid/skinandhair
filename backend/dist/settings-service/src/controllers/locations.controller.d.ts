import { LocationsService } from '../services/locations.service';
import { Location } from '../entities/location.entity';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    findAll(): Promise<Location[]>;
    getUserBranches(): Promise<Location[]>;
}
