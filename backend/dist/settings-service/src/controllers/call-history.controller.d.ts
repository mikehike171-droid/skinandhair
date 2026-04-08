import { CallHistoryService } from '../services/call-history.service';
export declare class CallHistoryController {
    private readonly callHistoryService;
    constructor(callHistoryService: CallHistoryService);
    getAllCallHistory(page?: string, limit?: string, locationId?: string, fromDate?: string, toDate?: string, req?: any): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyCallHistory(page?: string, limit?: string, locationId?: string, fromDate?: string, toDate?: string, userId?: string, req?: any): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getCallHistoryByUser(userId: string, page?: string, limit?: string, locationId?: string, fromDate?: string, toDate?: string): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
