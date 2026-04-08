import { Repository } from 'typeorm';
import { PatientExamination } from '../entities/patient-examination.entity';
import { PaymentInstallment } from '../entities/payment-installment.entity';
export declare class PatientExaminationService {
    private patientExaminationRepository;
    private paymentInstallmentRepository;
    constructor(patientExaminationRepository: Repository<PatientExamination>, paymentInstallmentRepository: Repository<PaymentInstallment>);
    create(createExaminationDto: any, userId: number): Promise<PatientExamination>;
    findByPatientId(patientId: string): Promise<PatientExamination[]>;
    findLatestByPatientId(patientId: string): Promise<PatientExamination>;
    update(id: number, updateExaminationDto: any): Promise<PatientExamination>;
    remove(id: number): Promise<void>;
    savePayments(examinationId: number, paymentData: any): Promise<any>;
    getPayments(examinationId: number): Promise<any>;
    addPayment(examinationId: number, paymentData: {
        paymentMethod: string;
        amount: number;
        notes?: string;
    }): Promise<any>;
    getPaymentInstallments(examinationId: number): Promise<any>;
    debugExamination(examinationId: number): Promise<any>;
    getPaymentReceipt(examinationId: number): Promise<any>;
    getInstallmentReceipt(installmentId: number): Promise<any>;
    getDailyReceipt(examinationId: number): Promise<any>;
    updateNRList(updateData: any): Promise<any>;
    getDuePatients(page?: number, limit?: number): Promise<any>;
    getNRList(page?: number, limit?: number, fromDate?: string, toDate?: string): Promise<any>;
    runFileMigration(): Promise<{
        success: boolean;
        message: any;
    }>;
    addReportFiles(examinationId: number, fileNames: string[]): Promise<any>;
    getReportFiles(examinationId: number): Promise<any>;
    deleteReportFile(examinationId: number, filename: string, uploadDir: string): Promise<any>;
}
