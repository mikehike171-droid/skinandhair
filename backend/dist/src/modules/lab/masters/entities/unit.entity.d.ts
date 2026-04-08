export declare class Unit {
    id: number;
    code: string;
    description: string;
    status: string;
    locationId: number;
    createdAt: Date;
    updatedAt: Date;
    get isActive(): boolean;
}
