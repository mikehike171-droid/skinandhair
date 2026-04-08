import { PatientExaminationService } from '../services/patient-examination.service';
export declare class PatientExaminationController {
    private readonly patientExaminationService;
    constructor(patientExaminationService: PatientExaminationService);
    create(createExaminationDto: any, req: any): Promise<import("../entities/patient-examination.entity").PatientExamination>;
    getDuePatients(page?: string, limit?: string): Promise<any>;
    getNRList(page?: string, limit?: string, fromDate?: string, toDate?: string): Promise<any>;
    testNRList(): Promise<{
        message: string;
        timestamp: Date;
    }>;
    debugExamination(id: number): Promise<any>;
    getInstallmentReceipt(installmentId: number): Promise<any>;
    findByPatientId(patientId: string): Promise<import("../entities/patient-examination.entity").PatientExamination[]>;
    findLatestByPatientId(patientId: string): Promise<import("../entities/patient-examination.entity").PatientExamination>;
    update(id: number, updateExaminationDto: any): Promise<import("../entities/patient-examination.entity").PatientExamination>;
    remove(id: number): Promise<void>;
    savePayments(id: number, paymentData: any): Promise<any>;
    getPayments(id: number): Promise<any>;
    addPayment(id: number, paymentData: {
        paymentMethod: string;
        amount: number;
        notes?: string;
    }): Promise<any>;
    getPaymentInstallments(id: number): Promise<any>;
    getPaymentReceipt(id: number): Promise<any>;
    getDailyReceipt(id: number): Promise<any>;
    uploadReports(id: number, files: any[]): Promise<any>;
    getReports(id: number): Promise<any>;
    deleteReport(id: number, filename: string): Promise<any>;
}
