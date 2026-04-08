import { Repository } from 'typeorm';
import { MobileNumber } from '../entities/mobile-number.entity';
export declare class MobileNumbersService {
    private mobileNumberRepository;
    constructor(mobileNumberRepository: Repository<MobileNumber>);
    getMobileNumbersByUserId(userId: number, page?: number, limit?: number, locationId?: number, fromDate?: string, toDate?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyNextCallDateNumbers(userId: number, page?: number, limit?: number, locationId?: number, fromDate?: string, toDate?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getNextCallDateNumbers(userId: number, page?: number, limit?: number, locationId?: number, fromDate?: string, toDate?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getTodayCallsByUserId(userId: number, page?: number, limit?: number, locationId?: number): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAllMobileNumbers(userId: number): Promise<MobileNumber[]>;
    getAllUnassignedNumbers(page?: number, limit?: number): Promise<{
        data: MobileNumber[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    addMobileNumber(mobile: string, userId: number, locationId: number): Promise<MobileNumber>;
    bulkUpload(file: any, userId: number, locationId: number): Promise<{
        success: boolean;
        message: string;
        count: number;
    }>;
    getMyOBCallHistory(userId: number, page?: number, limit?: number, locationId?: number, fromDate?: string, toDate?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
