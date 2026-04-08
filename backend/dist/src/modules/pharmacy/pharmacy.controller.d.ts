import { PharmacyService } from './pharmacy.service';
export declare class PharmacyController {
    private readonly pharmacyService;
    constructor(pharmacyService: PharmacyService);
    getPrescriptions(locationId: number): Promise<any>;
    updatePrescriptionStatus(id: number, status: number): Promise<{
        message: string;
    }>;
    getMedicines(locationId: number): Promise<import("./entities/pharmacy.entity").Medicine[]>;
}
