import { RenewalService } from '../services/renewal.service';
export declare class RenewalController {
    private readonly renewalService;
    constructor(renewalService: RenewalService);
    getRenewalPatients(req: any, locationId?: string, fromDate?: string, toDate?: string): Promise<any>;
}
