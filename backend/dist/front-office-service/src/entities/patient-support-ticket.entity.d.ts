export declare class PatientSupportTicket {
    id: number;
    ticketNumber: string;
    patientId: number;
    locationId: number;
    subject: string;
    description: string;
    priority: string;
    status: string;
    assignedTo: number;
    createdAt: Date;
    updatedAt: Date;
}
