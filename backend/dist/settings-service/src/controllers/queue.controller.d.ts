import { MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { QueueService } from '../services/queue.service';
export declare class QueueController {
    private readonly queueService;
    constructor(queueService: QueueService);
    getDoctorsByDepartment(locationId?: number): Promise<{
        doctorsByDepartment: {};
    }>;
    getQueueAppointments(locationId?: number): Promise<{
        doctors: any[];
        locationId: number;
        date: string;
        timestamp: string;
    } | {
        doctors: any[];
    }>;
    updateAppointmentStatus(id: string, body: {
        status: string;
    }): Promise<{
        message: string;
        appointmentId: string;
        status: string;
    }>;
    testQueue(): Promise<{
        message: string;
        timestamp: string;
    }>;
    streamQueueUpdates(locationId?: number): Observable<MessageEvent>;
}
