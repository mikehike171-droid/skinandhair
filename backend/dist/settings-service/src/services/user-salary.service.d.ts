import { Repository } from 'typeorm';
import { UserSalaryDetails } from '../entities/user-salary-details.entity';
export declare class UserSalaryService {
    private salaryRepository;
    constructor(salaryRepository: Repository<UserSalaryDetails>);
    create(data: Partial<UserSalaryDetails>): Promise<UserSalaryDetails>;
    findByUserId(userId: number): Promise<UserSalaryDetails[]>;
}
