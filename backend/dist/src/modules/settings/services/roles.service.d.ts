import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { UserAccess } from '../entities/user-access.entity';
import { Module } from '../entities/module.entity';
import { User } from '../entities/user.entity';
export declare class RolesService {
    private roleRepository;
    private userAccessRepository;
    private moduleRepository;
    private userRepository;
    constructor(roleRepository: Repository<Role>, userAccessRepository: Repository<UserAccess>, moduleRepository: Repository<Module>, userRepository: Repository<User>);
    findAll(locationId?: number, includeModules?: boolean): Promise<Role[]>;
    findOne(id: number): Promise<Role>;
    create(roleData: Partial<Role>): Promise<Role>;
    update(id: number, roleData: Partial<Role>): Promise<Role>;
    remove(id: number): Promise<void>;
    getRolePermissions(roleId: number): Promise<any[]>;
    updateRolePermissions(roleId: number, permissions: any[]): Promise<void>;
}
