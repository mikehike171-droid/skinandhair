import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserInfo } from '../entities/user-info.entity';
export declare class ProfileService {
    private userRepository;
    private userInfoRepository;
    constructor(userRepository: Repository<User>, userInfoRepository: Repository<UserInfo>);
    getProfile(userId: number): Promise<{
        id: number;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        userInfo: UserInfo;
    }>;
    updateProfile(userId: number, updateData: any): Promise<{
        message: string;
    }>;
    changePassword(userId: number, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
