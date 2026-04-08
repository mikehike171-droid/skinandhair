import { AppointmentService } from '../services/appointment.service';
import { UserLocationService } from '../services/user-location.service';
export declare class AppointmentController {
    private readonly appointmentService;
    private readonly userLocationService;
    constructor(appointmentService: AppointmentService, userLocationService: UserLocationService);
    getAppointments(req: any, fromDate?: string, toDate?: string, status?: string, search?: string, page?: number, limit?: number, queryLocationId?: string, doctorId?: string): Promise<{
        data: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        stats: {
            total: number;
            waiting: number;
            withDoctor: number;
            completed: number;
        };
        timestamp: string;
    } | {
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        stats?: undefined;
        timestamp?: undefined;
    }>;
    getMyAppointments(req: any, page?: number, limit?: number, fromDate?: string, toDate?: string): Promise<{
        data: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        timestamp: string;
    } | {
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        timestamp?: undefined;
    }>;
    getDoctorAppointments(req: any, doctorId: string, page?: number, limit?: number): Promise<{
        data: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPatientAppointments(req: any, patientId: number): Promise<{
        id: number;
        appointmentId: string;
        appointmentDate: string;
        appointmentTime: string;
        appointmentType: string;
        doctorName: string;
        notes: string;
        createdAt: Date;
    }[]>;
    createAppointment(req: any, appointmentData: any): Promise<{
        message: string;
        appointment: {
            id: number;
            appointmentId: string;
        };
    }>;
    updateNextCallDate(req: any, patientId: string, updateData: {
        nextCallDate: string;
    }): Promise<{
        message: string;
        patientId: number;
        nextCallDate: string;
    }>;
    getAppointmentById(id: string): Promise<{
        id: any;
        patientId: any;
        doctorId: any;
        appointmentDate: any;
        appointmentTime: any;
        type: any;
        status: any;
        notes: any;
        patientName: string;
        doctorName: string;
    }>;
    updateAppointment(id: string, updateData: any): Promise<{
        message: string;
        appointmentId: string;
    }>;
}
