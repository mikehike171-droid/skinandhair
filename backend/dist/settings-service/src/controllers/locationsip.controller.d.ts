import { LocationsIpService } from '../services/locationsip.service';
export declare class LocationsIpController {
    private readonly locationsIpService;
    constructor(locationsIpService: LocationsIpService);
    findAll(): Promise<any>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
