import { User } from './user.entity';
import { Location } from './location.entity';
import { Role } from './role.entity';
import { Department } from './department.entity';
export declare class UserLocationPermission {
    id: number;
    userId: number;
    locationId: number;
    roleId: number;
    departmentId: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    location: Location;
    role: Role;
    department: Department;
}
