import { Location } from './location.entity';
export declare class QueueToken {
    id: number;
    tokenNumber: string;
    patientId: number;
    appointmentId: number;
    department: string;
    priorityLevel: number;
    estimatedWaitTime: number;
    status: string;
    locationId: number;
    createdAt: Date;
    calledAt: Date;
    completedAt: Date;
    location: Location;
}
