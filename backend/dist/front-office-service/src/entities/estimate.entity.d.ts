import { Location } from './location.entity';
import { EstimateItem } from './estimate-item.entity';
export declare class Estimate {
    id: number;
    estimateNumber: string;
    locationId: number;
    patientId: number;
    patientName: string;
    patientPhone: string;
    totalAmount: number;
    discountAmount: number;
    netAmount: number;
    validUntil: Date;
    status: string;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
    location: Location;
    items: EstimateItem[];
}
