export declare class CreateEstimateItemDto {
    itemName: string;
    itemCode?: string;
    quantity: number;
    unitPrice: number;
    category?: string;
}
export declare class CreateEstimateDto {
    locationId: number;
    patientId?: number;
    patientName?: string;
    patientPhone?: string;
    discountAmount?: number;
    validUntil?: string;
    items: CreateEstimateItemDto[];
    createdBy: number;
}
