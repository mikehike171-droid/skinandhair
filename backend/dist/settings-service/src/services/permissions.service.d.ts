import { Repository } from 'typeorm';
import { UserAccess } from '../entities/user-access.entity';
import { ModulesService } from './modules.service';
export declare class PermissionsService {
    private userAccessRepository;
    private modulesService;
    constructor(userAccessRepository: Repository<UserAccess>, modulesService: ModulesService);
    getRolePermissions(roleId: number): Promise<UserAccess[]>;
    updateRolePermissions(roleId: number, permissions: Partial<UserAccess>[]): Promise<UserAccess[]>;
    getModulePermissions(): Promise<any[]>;
    getRolePermissionsWithModules(roleId: number): Promise<any[]>;
    getModulesWithPermissions(roleId: number): Promise<any[]>;
}
