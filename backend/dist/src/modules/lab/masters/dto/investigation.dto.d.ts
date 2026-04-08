export declare class CreateInvestigationDto {
    code: string;
    description: string;
    method?: string;
    unitId?: number;
    resultType?: string;
    defaultValue?: string;
    locationId?: number;
    isActive?: boolean;
}
export declare class UpdateInvestigationDto {
    code?: string;
    description?: string;
    method?: string;
    unitId?: number;
    resultType?: string;
    defaultValue?: string;
    locationId?: number;
    isActive?: boolean;
}
