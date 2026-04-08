import { Repository } from 'typeorm';
import { MobileNumber } from '../entities/mobile-number.entity';
export declare class CallHistoryService {
    private mobileNumberRepository;
    constructor(mobileNumberRepository: Repository<MobileNumber>);
    getAllCallHistory(page?: number, limit?: number, locationId?: number, fromDate?: string, toDate?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getCallHistoryByUser(userId: number, page?: number, limit?: number, locationId?: number, fromDate?: string, toDate?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
