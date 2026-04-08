import { PatientExamination } from './patient-examination.entity';
export declare class PatientPayments {
    id: number;
    patientExaminationId: number;
    paymentMethod: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    patientExamination: PatientExamination;
}
