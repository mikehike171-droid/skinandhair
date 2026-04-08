import { Repository } from 'typeorm';
import { MobileNumber } from '../entities/mobile-number.entity';
export declare class MobileAssignService {
    private mobileNumberRepository;
    constructor(mobileNumberRepository: Repository<MobileNumber>);
    getUnassignedNumbers(page?: number, limit?: number): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUsers(locationId: string): Promise<any>;
    assignNumbers(mobileIds: number[], userId: number, assignedBy: number): Promise<{
        success: boolean;
        message: string;
        count: number;
    }>;
}
