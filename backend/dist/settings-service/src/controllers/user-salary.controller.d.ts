import { UserSalaryService } from '../services/user-salary.service';
export declare class UserSalaryController {
    private readonly salaryService;
    constructor(salaryService: UserSalaryService);
    create(data: any): Promise<import("../entities/user-salary-details.entity").UserSalaryDetails>;
    findByUserId(userId: string): Promise<import("../entities/user-salary-details.entity").UserSalaryDetails[]>;
}
