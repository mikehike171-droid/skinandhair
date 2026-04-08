import { Estimate } from './estimate.entity';
export declare class EstimateItem {
    id: number;
    estimateId: number;
    itemName: string;
    itemCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    category: string;
    estimate: Estimate;
}
