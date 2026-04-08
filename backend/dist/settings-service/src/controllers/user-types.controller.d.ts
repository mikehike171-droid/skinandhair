import { UserTypesService } from '../services/user-types.service';
export declare class UserTypesController {
    private readonly userTypesService;
    constructor(userTypesService: UserTypesService);
    getUserTypes(): Promise<import("../entities/user-type.entity").UserType[]>;
    createUserType(data: any): Promise<import("../entities/user-type.entity").UserType[]>;
    updateUserType(id: number, data: any): Promise<import("../entities/user-type.entity").UserType>;
    deleteUserType(id: number): Promise<{
        message: string;
    }>;
}
