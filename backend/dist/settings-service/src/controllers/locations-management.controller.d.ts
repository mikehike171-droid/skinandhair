import { LocationsService } from '../services/locations.service';
export declare class LocationsManagementController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    getLocations(): Promise<import("../entities/location.entity").Location[]>;
    getLocation(id: string): Promise<import("../entities/location.entity").Location>;
    testPing(): Promise<{
        message: string;
        timestamp: Date;
    }>;
    createLocation(locationData: any): Promise<import("../entities/location.entity").Location>;
    updateLocation(id: string, locationData: any): Promise<import("../entities/location.entity").Location>;
    deleteLocation(id: string): Promise<import("../entities/location.entity").Location>;
}
