import { MobileAssignService } from '../services/mobile-assign.service';
export declare class MobileAssignController {
    private readonly mobileAssignService;
    constructor(mobileAssignService: MobileAssignService);
    getUnassignedNumbers(req: any): Promise<{
        data: any;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUsers(req: any): Promise<any>;
    assignNumbers(data: {
        mobileIds: number[];
        userId: number;
    }, req: any): Promise<{
        success: boolean;
        message: string;
        count: number;
    }>;
}
