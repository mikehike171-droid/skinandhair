import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { CreateAttendanceDto, UpdateAttendanceDto, CheckInOutDto } from '../dto/attendance.dto';
export declare class AttendanceService {
    private attendanceRepository;
    constructor(attendanceRepository: Repository<Attendance>);
    checkInOut(checkInOutDto: CheckInOutDto): Promise<Attendance>;
    create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance>;
    findAll(locationId?: number, userId?: number, date?: string, page?: number, limit?: number): Promise<Attendance[] | {
        data: Attendance[];
        totalRecords: number;
        totalPages: number;
        currentPage: number;
    }>;
    findOne(id: number): Promise<Attendance>;
    update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance>;
    remove(id: number): Promise<void>;
    getUserTodayAttendance(userId: number, locationId: number): Promise<Attendance[]>;
    getAttendanceByDate(userId: number, locationId: number, date: string): Promise<any>;
    getGroupedAttendance(userId: number, locationId: number): Promise<any>;
    getGroupedAttendancePaginated(userId: number, locationId: number, page: number, limit: number): Promise<{
        data: any;
        totalRecords: number;
        totalPages: number;
        currentPage: number;
    }>;
    updateAvailableStatus(userId: number, locationId: number, userStatusId: number): Promise<Attendance>;
    getTotalDuration(userId: number, locationId: number, date: string): Promise<number>;
    getAttendanceStats(userId: number, locationId: number): Promise<{
        thisMonth: number;
        thisWeek: number;
        avgHours: string;
        todayHours: string;
    }>;
    getLeaveApplications(locationId?: number, userId?: number, page?: number, limit?: number, fromDate?: string, toDate?: string): Promise<Attendance[] | {
        data: Attendance[];
        totalRecords: number;
        totalPages: number;
        currentPage: number;
    }>;
    getAttendanceReport(locationId: number, fromMonth?: string, toMonth?: string, departmentId?: number, userId?: number, page?: number, limit?: number): Promise<any[] | {
        data: any;
        totalRecords: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    }>;
    getDetailedAttendanceReport(locationId: number, fromDate?: string, toDate?: string, departmentId?: number, userId?: number, page?: number, limit?: number): Promise<{
        data: any;
        totalRecords: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    }>;
    searchDoctors(searchTerm: string, locationId: number): Promise<{
        success: boolean;
        data: any;
        count: any;
    }>;
    private calculateDuration;
}
