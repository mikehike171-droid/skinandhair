import { Repository, DataSource } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Doctor } from '../entities/doctor.entity';
export declare class AppointmentService {
    private appointmentRepository;
    private doctorRepository;
    private dataSource;
    constructor(appointmentRepository: Repository<Appointment>, doctorRepository: Repository<Doctor>, dataSource: DataSource);
    getAppointments(filters: {
        fromDate?: string;
        toDate?: string;
        status?: string;
        search?: string;
        page: number;
        limit: number;
        locationId?: number;
        doctorId?: number;
    }): Promise<{
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
    getMyDoctorAppointments(doctorId: number, page?: number, limit?: number, fromDate?: string, toDate?: string): Promise<{
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
    getPatientAppointments(patientId: number, locationId?: number): Promise<{
        id: number;
        appointmentId: string;
        appointmentDate: string;
        appointmentTime: string;
        appointmentType: string;
        doctorName: string;
        notes: string;
        createdAt: Date;
    }[]>;
    createAppointment(appointmentData: any, locationId: number): Promise<{
        message: string;
        appointment: {
            id: number;
            appointmentId: string;
        };
    }>;
    updateNextCallDate(patientId: number, nextCallDate: string, userId: number, locationId: number): Promise<{
        message: string;
        patientId: number;
        nextCallDate: string;
    }>;
    getAppointmentById(appointmentId: string): Promise<{
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
    updateAppointment(appointmentId: string, updateData: any): Promise<{
        message: string;
        appointmentId: string;
    }>;
    getDoctorAppointmentsWithUserDetails(doctorId: number, page?: number, limit?: number, fromDate?: string, toDate?: string): Promise<{
        data: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
