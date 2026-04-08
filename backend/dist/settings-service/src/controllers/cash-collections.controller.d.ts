import { CashCollectionsService } from '../services/cash-collections.service';
export declare class CashCollectionsController {
    private readonly cashCollectionsService;
    constructor(cashCollectionsService: CashCollectionsService);
    getCashCollections(locationId?: string, page?: string, limit?: string, fromDate?: string, toDate?: string): Promise<{
        data: {
            date: any;
            credit: any;
            debit: any;
            balance: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
        summary: {
            totalCash: any;
            totalExpenses: any;
            currentBalance: number;
        };
    }>;
}
