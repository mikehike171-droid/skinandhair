import { AuthService } from './auth.service';
declare class LoginDto {
    username: string;
    password: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        data: {
            access_token: any;
            UserInfo: {
                id: number;
                user_name: string;
                email: string;
                role_id: any;
                department_id: any;
                primary_location_id: number;
                location_id: string;
                phone_number: string;
            };
            sidemenu: any[];
            moduleAccess: any[];
        };
    }>;
}
export {};
