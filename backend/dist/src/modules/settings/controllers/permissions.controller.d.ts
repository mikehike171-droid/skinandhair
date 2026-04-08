import { PermissionsService } from '../services/permissions.service';
import { UserAccess } from '../entities/user-access.entity';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    getModulePermissions(): Promise<any[]>;
    getRolePermissions(roleId: string): Promise<UserAccess[]>;
    getRolePermissionsWithModules(roleId: string): Promise<any[]>;
    getModulesWithPermissions(roleId: string): Promise<any[]>;
    updateRolePermissions(roleId: string, permissions: Partial<UserAccess>[]): Promise<UserAccess[]>;
}
