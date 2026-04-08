import { MobileNumbersService } from '../services/mobile-numbers.service';
export declare class MobileNumbersController {
    private readonly mobileNumbersService;
    constructor(mobileNumbersService: MobileNumbersService);
    healthCheck(): Promise<{
        status: string;
        message: string;
        timestamp: string;
        version: string;
    }>;
    getMyNextCallDateNumbers(req: any, page?: number, limit?: number, locationId?: number, fromDate?: string, toDate?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getNextCallDateNumbers(req: any, page?: number, limit?: number, locationId?: number, fromDate?: string, toDate?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyOBCallHistory(req: any, page?: number, limit?: number, locationId?: number, fromDate?: string, toDate?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getTodayCalls(req: any, page?: number, limit?: number, locationId?: number): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyMobileNumbers(req: any, page?: number, limit?: number, locationId?: number, fromDate?: string, toDate?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMobileNumbersByUser(userId: number, page?: number, limit?: number, locationId?: number, fromDate?: string, toDate?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAllMobileNumbers(req: any, page?: number, limit?: number): Promise<{
        data: import("../entities/mobile-number.entity").MobileNumber[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    bulkUpload(file: any, req: any): Promise<{
        success: boolean;
        message: string;
        count: number;
    }>;
    addMobileNumber(data: {
        mobile: string;
    }, req: any): Promise<import("../entities/mobile-number.entity").MobileNumber>;
}
