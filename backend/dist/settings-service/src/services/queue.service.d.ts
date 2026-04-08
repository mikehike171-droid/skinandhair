import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInfo } from '../entities/user-info.entity';
import { Department } from '../entities/department.entity';
import { Attendance } from '../entities/attendance.entity';
import { UserLocationPermission } from '../entities/user-location-permission.entity';
import { Subject } from 'rxjs';
export declare class QueueService {
    private userRepository;
    private userInfoRepository;
    private departmentRepository;
    private attendanceRepository;
    private userLocationPermissionRepository;
    private dataSource;
    queueUpdateSubject: Subject<{
        locationId: number;
    }>;
    constructor(userRepository: Repository<User>, userInfoRepository: Repository<UserInfo>, departmentRepository: Repository<Department>, attendanceRepository: Repository<Attendance>, userLocationPermissionRepository: Repository<UserLocationPermission>, dataSource: DataSource);
    getQueueAppointments(locationId: number): Promise<{
        doctors: any[];
        locationId: number;
        date: string;
        timestamp: string;
    }>;
    updateAppointmentStatus(appointmentId: string, status: string): Promise<{
        message: string;
        appointmentId: string;
        status: string;
    }>;
    getDoctorsByDepartment(locationId: number): Promise<{
        doctorsByDepartment: {};
    }>;
}
