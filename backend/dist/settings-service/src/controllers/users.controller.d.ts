import { UsersService } from '../services/users.service';
import { User } from '../entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: Partial<User>): Promise<User>;
    findAll(locationId?: string, page?: string, limit?: string, departmentId?: string, search?: string): Promise<{
        users: User[];
        total: number;
        totalPages: number;
    }>;
    getMobileNumbersForUser(userId: string): Promise<any[]>;
    submitCallRecord(userId: string, callData: {
        mobileNumberId: number;
        disposition: string;
        patientFeeling?: string;
        notes?: string;
        nextCallDate?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: Partial<User>): Promise<User>;
    toggleStatus(id: string): Promise<User>;
    getUserDepartment(id: string, locationId: string): Promise<{
        departmentName: string;
    }>;
    remove(id: string): Promise<void>;
}
