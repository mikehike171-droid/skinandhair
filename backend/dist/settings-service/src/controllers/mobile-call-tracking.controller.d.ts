import { MobileCallTrackingService } from '../services/mobile-call-tracking.service';
export declare class MobileCallTrackingController {
    private readonly mobileCallTrackingService;
    constructor(mobileCallTrackingService: MobileCallTrackingService);
    getMyNumbers(req: any): Promise<any>;
    test(): Promise<{
        message: string;
        timestamp: Date;
    }>;
    updateCall(id: string, callData: any, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
