export declare class PatientExamination {
    id: number;
    patientId: number;
    locationId: number;
    pastMedicalReports: string;
    investigationsRequired: string;
    physicalExamination: string;
    bp: string;
    pulse: string;
    heartRate: string;
    weight: string;
    rr: string;
    menstrualObstetricHistory: string;
    file: string;
    treatmentPlanMonthsDoctor: number;
    nextRenewalDateDoctor: Date;
    treatmentPlanMonthsPro: number;
    nextRenewalDatePro: Date;
    totalAmount: number;
    discountAmount: number;
    paidAmount: number;
    dueAmount: number;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
}
