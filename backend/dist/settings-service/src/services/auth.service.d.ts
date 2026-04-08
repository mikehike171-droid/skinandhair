import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    login(loginDto: {
        username: string;
        password: string;
        userIp?: string;
    }): Promise<{
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
    switchLocation(userId: number, locationId: number): Promise<{
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
