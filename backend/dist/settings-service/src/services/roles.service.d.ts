import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { UserAccess } from '../entities/user-access.entity';
import { Module } from '../entities/module.entity';
import { SubModule } from '../entities/sub-module.entity';
import { User } from '../entities/user.entity';
import { ModulesService } from './modules.service';
export declare class RolesService {
    private roleRepository;
    private userAccessRepository;
    private moduleRepository;
    private subModuleRepository;
    private userRepository;
    private modulesService;
    constructor(roleRepository: Repository<Role>, userAccessRepository: Repository<UserAccess>, moduleRepository: Repository<Module>, subModuleRepository: Repository<SubModule>, userRepository: Repository<User>, modulesService: ModulesService);
    findAll(locationId?: number, includeModules?: boolean): Promise<Role[]>;
    findOne(id: number): Promise<Role>;
    create(roleData: Partial<Role>): Promise<Role>;
    update(id: number, roleData: Partial<Role>): Promise<Role>;
    remove(id: number): Promise<Role>;
    getRolePermissions(roleId: number, locationId?: number): Promise<any[]>;
    private getPermissionForModule;
    updateRolePermissions(roleId: number, permissions: any[]): Promise<void>;
}
