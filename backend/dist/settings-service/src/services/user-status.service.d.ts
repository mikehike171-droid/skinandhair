import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
export declare class UserStatusService {
    private attendanceRepository;
    constructor(attendanceRepository: Repository<Attendance>);
    findAll(): Promise<any>;
}
