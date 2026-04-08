import { UserStatusService } from '../services/user-status.service';
export declare class UserStatusController {
    private readonly userStatusService;
    constructor(userStatusService: UserStatusService);
    findAll(): Promise<any>;
}
