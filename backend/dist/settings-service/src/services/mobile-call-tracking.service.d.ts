import { Repository } from 'typeorm';
import { MobileNumber } from '../entities/mobile-number.entity';
import { MobileNumberNextCall } from '../entities/mobile-number-next-call.entity';
export declare class MobileCallTrackingService {
    private mobileNumberRepository;
    private nextCallRepository;
    constructor(mobileNumberRepository: Repository<MobileNumber>, nextCallRepository: Repository<MobileNumberNextCall>);
    getAssignedNumbers(userId: number): Promise<any>;
    updateCallDetails(mobileId: number, callData: any, userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
