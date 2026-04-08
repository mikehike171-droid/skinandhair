import { RolePermission } from './role-permission.entity';
export declare class Role {
    id: number;
    name: string;
    code: string;
    description: string;
    isActive: boolean;
    permissions: RolePermission[];
    createdAt: Date;
    updatedAt: Date;
}
