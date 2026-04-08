import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UserLocationService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getUserLocationId(userId: number): Promise<number>;
    getUserDetails(userId: number): Promise<any>;
}
