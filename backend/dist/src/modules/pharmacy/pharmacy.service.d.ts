import { Repository } from 'typeorm';
import { Medicine, Prescription, PrescriptionItem } from './entities/pharmacy.entity';
export declare class PharmacyService {
    private medicineRepository;
    private prescriptionRepository;
    private prescriptionItemRepository;
    constructor(medicineRepository: Repository<Medicine>, prescriptionRepository: Repository<Prescription>, prescriptionItemRepository: Repository<PrescriptionItem>);
    getPrescriptions(locationId: number): Promise<any>;
    updatePrescriptionStatus(prescriptionId: number, status: number): Promise<{
        message: string;
    }>;
    getMedicines(locationId: number): Promise<Medicine[]>;
}
