export declare class Investigation {
    id: number;
    code: string;
    description: string;
    method: string;
    unitId: number;
    resultType: string;
    defaultValue: string;
    locationId: number;
    unitDescription?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    get isActive(): boolean;
}
