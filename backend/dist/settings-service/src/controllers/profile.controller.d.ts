import { ProfileService } from '../services/profile.service';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(req: any): Promise<{
        id: number;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        userInfo: import("../entities/user-info.entity").UserInfo;
    }>;
    updateProfile(req: any, updateData: any): Promise<{
        message: string;
    }>;
    changePassword(req: any, changePasswordDto: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
