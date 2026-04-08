import { Repository, DataSource } from 'typeorm';
import { CallHistory } from '../entities/call-history.entity';
export declare class TelecallerService {
    private callHistoryRepository;
    private dataSource;
    constructor(callHistoryRepository: Repository<CallHistory>, dataSource: DataSource);
    getCallHistory(patientId: string, locationId?: number, userId?: string): Promise<{
        sno: number;
        dateTime: string;
        nextCallDate: string;
        disposition: string;
        callerName: any;
        patientFeeling: string;
        notes: string;
    }[]>;
    addCallRecord(patientId: string, callData: any, userId: string, locationId?: number): Promise<{
        success: boolean;
        message: string;
        data: CallHistory;
    }>;
}
