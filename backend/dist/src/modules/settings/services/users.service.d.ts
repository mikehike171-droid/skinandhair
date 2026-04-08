import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInfo } from '../entities/user-info.entity';
export declare class UsersService {
    private userRepository;
    private userInfoRepository;
    constructor(userRepository: Repository<User>, userInfoRepository: Repository<UserInfo>);
    findAll(locationId?: number, page?: number, limit?: number, departmentId?: number): Promise<{
        users: User[];
        total: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<any>;
    create(userData: any): Promise<User>;
    update(id: number, userData: any): Promise<User>;
    remove(id: number): Promise<void>;
    toggleStatus(id: number): Promise<User>;
    getMobileNumbers(userId: number): Promise<any[]>;
    debugMobileNumbers(): Promise<any[]>;
    saveCallRecord(callData: any): Promise<any>;
}
