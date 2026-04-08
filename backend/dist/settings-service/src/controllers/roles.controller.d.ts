import { RolesService } from '../services/roles.service';
import { Role } from '../entities/role.entity';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: Partial<Role>): Promise<Role>;
    findAll(locationId?: string, includeModules?: string): Promise<Role[]>;
    findOne(id: string): Promise<Role>;
    update(id: string, updateRoleDto: Partial<Role>): Promise<Role>;
    remove(id: string): Promise<Role>;
    getRolePermissions(id: string, locationId?: string): Promise<any[]>;
    updateRolePermissions(id: string, body: {
        permissions: any[];
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
