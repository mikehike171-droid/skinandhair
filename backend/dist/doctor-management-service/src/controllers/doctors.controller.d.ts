import { DoctorsService } from '../services/doctors.service';
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
    getDoctors(locationId?: number): Promise<any>;
    getDoctorTimeslots(locationId?: number): Promise<any>;
    getAllDoctorTimeslots(locationId?: number): Promise<any>;
    createBulkTimeslots(data: {
        userId: number;
        date: string;
        fromTime: string;
        toTime: string;
        duration: number;
        locationId: number;
    }): Promise<{
        success: boolean;
        count: number;
        data: any[];
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        count?: undefined;
        data?: undefined;
    }>;
    updateTimeslotStatus(id: number, data: {
        isActive: boolean;
    }): Promise<{
        success: boolean;
        data: any;
    }>;
    getConsultationFees(locationId?: number): Promise<any>;
    createConsultationFee(data: {
        userId: number;
        cashFee: number;
        locationId: number;
        departmentId: number;
    }): Promise<{
        success: boolean;
        data: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
    updateConsultationFee(id: number, data: {
        userId: number;
        cashFee: number;
        locationId?: number;
        departmentId?: number;
    }): Promise<{
        success: boolean;
        data: any;
    }>;
    deleteConsultationFee(id: number): Promise<{
        success: boolean;
    }>;
}
