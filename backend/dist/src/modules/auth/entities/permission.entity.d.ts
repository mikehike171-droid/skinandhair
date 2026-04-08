import { RolePermission } from './role-permission.entity';
export declare class Permission {
    id: number;
    name: string;
    code: string;
    description: string;
    module: string;
    action: string;
    roles: RolePermission[];
    createdAt: Date;
    updatedAt: Date;
}
