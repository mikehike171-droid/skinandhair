import { AttendanceService } from '../services/attendance.service';
import { CreateAttendanceDto, UpdateAttendanceDto, CheckInOutDto, UpdateAvailableStatusDto } from '../dto/attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    checkInOut(checkInOutDto: CheckInOutDto): Promise<import("../entities/attendance.entity").Attendance>;
    create(createAttendanceDto: CreateAttendanceDto): Promise<import("../entities/attendance.entity").Attendance>;
    findAll(locationId?: number, userId?: number, date?: string, page?: number, limit?: number): Promise<import("../entities/attendance.entity").Attendance[] | {
        data: import("../entities/attendance.entity").Attendance[];
        totalRecords: number;
        totalPages: number;
        currentPage: number;
    }>;
    getUserTodayAttendance(userId: number, locationId: number): Promise<import("../entities/attendance.entity").Attendance[]>;
    getAttendanceByDate(userId: number, date: string, locationId: number): Promise<any>;
    getGroupedAttendance(userId: number, locationId: number): Promise<any>;
    getGroupedAttendancePaginated(userId: number, locationId: number, page?: string, limit?: string): Promise<{
        data: any;
        totalRecords: number;
        totalPages: number;
        currentPage: number;
    }>;
    getTotalDuration(userId: number, locationId: number, date: string): Promise<{
        userId: number;
        locationId: number;
        date: string;
        totalDuration: number;
    }>;
    getAttendanceStats(userId: number, locationId: number): Promise<{
        thisMonth: number;
        thisWeek: number;
        avgHours: string;
        todayHours: string;
    }>;
    updateAvailableStatus(updateStatusDto: UpdateAvailableStatusDto): Promise<import("../entities/attendance.entity").Attendance>;
    getLeaveApplications(locationId?: string, userId?: string, page?: string, limit?: string, fromDate?: string, toDate?: string): Promise<import("../entities/attendance.entity").Attendance[] | {
        data: import("../entities/attendance.entity").Attendance[];
        totalRecords: number;
        totalPages: number;
        currentPage: number;
    }>;
    searchDoctors(searchTerm: string, locationId: number): Promise<{
        success: boolean;
        data: any;
        count: any;
    }>;
    findOne(id: number): Promise<import("../entities/attendance.entity").Attendance>;
    update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<import("../entities/attendance.entity").Attendance>;
    remove(id: number): Promise<{
        message: string;
    }>;
    getAttendanceReport(body: {
        locationId: number;
        fromMonth?: string;
        toMonth?: string;
        departmentId?: number;
        userId?: number;
        page?: number;
        limit?: number;
    }): Promise<any[] | {
        data: any;
        totalRecords: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    }>;
    getDetailedAttendanceReport(body: {
        locationId: number;
        fromDate?: string;
        toDate?: string;
        departmentId?: number;
        userId?: number;
        page?: number;
        limit?: number;
    }): Promise<{
        data: any;
        totalRecords: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    }>;
}
