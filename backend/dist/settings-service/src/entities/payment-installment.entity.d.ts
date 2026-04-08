import { PatientExamination } from './patient-examination.entity';
export declare class PaymentInstallment {
    id: number;
    patientExaminationId: number;
    installmentNumber: number;
    paymentMethod: string;
    amount: number;
    paymentDate: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    patientExamination: PatientExamination;
}
