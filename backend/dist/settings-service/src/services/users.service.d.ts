import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInfo } from '../entities/user-info.entity';
import { UserLocationPermission } from '../entities/user-location-permission.entity';
export declare class UsersService {
    private userRepository;
    private userInfoRepository;
    private userLocationPermissionRepository;
    constructor(userRepository: Repository<User>, userInfoRepository: Repository<UserInfo>, userLocationPermissionRepository: Repository<UserLocationPermission>);
    findAll(locationId?: number, page?: number, limit?: number, departmentId?: number, search?: string): Promise<{
        users: User[];
        total: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<any>;
    create(userData: any): Promise<User>;
    update(id: number, userData: any): Promise<any>;
    remove(id: number): Promise<void>;
    getUserDepartment(userId: number, locationId: number): Promise<{
        departmentName: string;
    }>;
    toggleStatus(id: number): Promise<User>;
    getMobileNumbersForUser(userId: number): Promise<any[]>;
    submitCallRecord(userId: number, callData: {
        mobileNumberId: number;
        disposition: string;
        patientFeeling?: string;
        notes?: string;
        nextCallDate?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
