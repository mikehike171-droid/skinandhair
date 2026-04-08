export declare class PatientTransfer {
    id: number;
    transferNumber: string;
    patientId: number;
    fromLocationId: number;
    toLocationId: number;
    fromBedId: number;
    toBedId: number;
    transferDate: Date;
    reason: string;
    status: string;
    transferredBy: number;
    receivedBy: number;
    createdAt: Date;
}
