import { Repository } from 'typeorm';
import { DoctorTimeslot } from '../entities/doctor-timeslot.entity';
import { User } from '../entities/user.entity';
import { DoctorConsultationFee } from '../entities/doctor-consultation-fee.entity';
import { ConfigService } from '@nestjs/config';
export declare class DoctorsService {
    private timeslotRepository;
    private userRepository;
    private consultationFeeRepository;
    private configService;
    constructor(timeslotRepository: Repository<DoctorTimeslot>, userRepository: Repository<User>, consultationFeeRepository: Repository<DoctorConsultationFee>, configService: ConfigService);
    getDoctors(locationId?: number): Promise<any>;
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
    getDoctorTimeslots(locationId?: number): Promise<any>;
    getAllDoctorTimeslots(locationId?: number): Promise<any>;
    updateTimeslotStatus(id: number, isActive: boolean): Promise<{
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
