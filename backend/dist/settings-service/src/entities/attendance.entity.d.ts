import { User } from './user.entity';
import { Location } from './location.entity';
import { UserStatus } from './user-status.entity';
export declare class Attendance {
    id: number;
    userId: number;
    locationId: number;
    date: string;
    checkIn: string;
    checkOut: string;
    duration: number;
    status: string;
    remarks: string;
    leave_type: string;
    leave_status: string;
    userStatusId: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    location: Location;
    userStatus: UserStatus;
}
