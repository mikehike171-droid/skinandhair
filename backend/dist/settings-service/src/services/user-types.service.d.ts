import { Repository } from 'typeorm';
import { UserType } from '../entities/user-type.entity';
export declare class UserTypesService {
    private userTypeRepository;
    constructor(userTypeRepository: Repository<UserType>);
    findAll(): Promise<UserType[]>;
    create(data: any): Promise<UserType[]>;
    update(id: number, data: any): Promise<UserType>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
