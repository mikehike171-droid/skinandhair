import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: Partial<User>): Promise<User>;
    findAll(locationId?: string, page?: string, limit?: string, departmentId?: string): Promise<{
        users: User[];
        total: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: Partial<User>): Promise<User>;
    toggleStatus(id: string): Promise<User>;
    remove(id: string): Promise<void>;
    getMobileNumbers(id: string): Promise<any[]>;
    testMobileNumbers(id: string): Promise<any[]>;
    debugMobileNumbers(): Promise<any[]>;
    mobileTest(id: string): Promise<any[]>;
    saveCallRecord(callData: any): Promise<any>;
}
