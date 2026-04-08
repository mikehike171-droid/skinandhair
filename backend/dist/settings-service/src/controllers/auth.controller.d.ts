import { AuthService } from '../services/auth.service';
declare class LoginDto {
    username: string;
    password: string;
    userIp?: string;
}
declare class SwitchLocationDto {
    userId: number;
    locationId: number;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        data: {
            access_token: string;
            UserInfo: {
                id: number;
                user_name: string;
                email: string;
                role_id: any;
                role_name: any;
                department_id: any;
                primary_location_id: number;
                location_id: string;
                phone_number: string;
            };
            sidemenu: any[];
            moduleAccess: any[];
        };
    }>;
    switchLocation(switchLocationDto: SwitchLocationDto): Promise<{
        UserInfo: {
            id: number;
            user_name: string;
            email: string;
            role_id: any;
            role_name: any;
            department_id: any;
            primary_location_id: number;
            location_id: string;
            phone_number: string;
        };
        sidemenu: any[];
        moduleAccess: any[];
    }>;
    refreshUserData(refreshDto: SwitchLocationDto): Promise<{
        UserInfo: {
            id: number;
            user_name: string;
            email: string;
            role_id: any;
            role_name: any;
            department_id: any;
            primary_location_id: number;
            location_id: string;
            phone_number: string;
        };
        sidemenu: any[];
        moduleAccess: any[];
    }>;
}
export {};
