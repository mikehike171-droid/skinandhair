import { LocationsService } from '../services/locations.service';
import { Location } from '../entities/location.entity';
export declare class LocationsPublicController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    getUserBranches(req: any): Promise<Location[]>;
}
