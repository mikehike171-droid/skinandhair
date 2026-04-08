import { UserInfo } from './user-info.entity';
export declare class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    primaryLocationId: number;
    isActive: boolean;
    userInfoId: number;
    employeeId: string;
    workingDays: string;
    workingHours: string;
    userInfo: UserInfo;
    createdAt: Date;
    updatedAt: Date;
}
