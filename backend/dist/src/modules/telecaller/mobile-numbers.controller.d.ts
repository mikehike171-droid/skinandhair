export declare class MobileNumbersController {
    getMobileNumbers(userId: string): Promise<{
        id: number;
        mobile_number: string;
        user_id: number;
        last_call_status: string;
        assigned_date: string;
    }[]>;
}
