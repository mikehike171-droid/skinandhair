export declare class MobileCallController {
    triggerMobileCall(body: {
        phone_number: string;
        patient_name?: string;
        patient_id?: number;
        requested_by?: string;
        user_id?: number;
    }): {
        success: boolean;
        message: string;
        data: {
            id: number;
            phone_number: string;
            patient_name: string;
            patient_id: number;
            requested_by: string;
            user_id: number;
            created_at: string;
        };
    };
    getMobileCallRequests(req: any): any[];
    deleteCallRequest(id: string): {
        success: boolean;
    };
}
