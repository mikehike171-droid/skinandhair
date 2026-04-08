import { DataSource } from 'typeorm';
export declare class PresentingComplaintsService {
    private dataSource;
    constructor(dataSource: DataSource);
    createTablesIfNotExist(): Promise<void>;
    savePatientPresentingComplaints(data: any, user: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getPatientPresentingComplaints(patientId: string): Promise<any>;
    deletePatientPresentingComplaint(id: number, user: any): Promise<{
        success: boolean;
    }>;
}
