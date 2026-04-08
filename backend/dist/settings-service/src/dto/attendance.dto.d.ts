export declare class CreateAttendanceDto {
    userId: number;
    locationId: number;
    date: string;
    checkIn?: string;
    checkOut?: string;
    status?: string;
    remarks?: string;
    leave_type?: string;
    leave_status?: string;
    userStatusId?: number;
}
export declare class UpdateAttendanceDto {
    checkIn?: string;
    checkOut?: string;
    status?: string;
    remarks?: string;
    leave_type?: string;
    leave_status?: string;
    userStatusId?: number;
}
export declare class CheckInOutDto {
    userId: number;
    locationId: number;
    type: 'check-in' | 'check-out';
}
export declare class UpdateAvailableStatusDto {
    userId: number;
    locationId: number;
    userStatusId: number;
}
