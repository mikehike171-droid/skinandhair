"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../entities/role.entity");
const user_access_entity_1 = require("../entities/user-access.entity");
const module_entity_1 = require("../entities/module.entity");
const user_entity_1 = require("../entities/user.entity");
let RolesService = class RolesService {
    constructor(roleRepository, userAccessRepository, moduleRepository, userRepository) {
        this.roleRepository = roleRepository;
        this.userAccessRepository = userAccessRepository;
        this.moduleRepository = moduleRepository;
        this.userRepository = userRepository;
    }
    async findAll(locationId, includeModules) {
        let roles;
        if (!locationId) {
            roles = await this.roleRepository.find({ order: { name: 'ASC' } });
        }
        else {
            roles = await this.roleRepository.find({
                where: [
                    { locationId: null },
                    { locationId: locationId }
                ],
                order: { name: 'ASC' }
            });
        }
        for (const role of roles) {
            const userCountResult = await this.userRepository.query('SELECT COUNT(DISTINCT user_id) as count FROM user_location_permissions WHERE role_id = $1', [role.id]);
            role.userCount = parseInt(userCountResult[0]?.count || '0');
            if (includeModules) {
                const userAccess = await this.userAccessRepository.find({
                    where: { roleId: role.id }
                });
                if (userAccess.length > 0) {
                    const moduleIds = [...new Set(userAccess.map(ua => ua.moduleId))];
                    const modules = await this.moduleRepository.find({
                        where: moduleIds.map(id => ({ id })),
                        select: ['name']
                    });
                    role.modules = modules.map(m => m.name);
                }
                else {
                    role.modules = [];
                }
            }
        }
        return roles;
    }
    async findOne(id) {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        return role;
    }
    async create(roleData) {
        try {
            console.log('Creating role with data:', roleData);
            const createData = { ...roleData };
            if (typeof createData.isActive !== 'undefined') {
                createData.isActive = createData.isActive ? 1 : 0;
            }
            const role = this.roleRepository.create(createData);
            const savedRole = await this.roleRepository.save(role);
            console.log('Role created successfully:', savedRole);
            return savedRole;
        }
        catch (error) {
            console.error('Error creating role:', error);
            throw error;
        }
    }
    async update(id, roleData) {
        console.log('Updating role with data:', roleData);
        const updateData = { ...roleData };
        if (typeof updateData.isActive !== 'undefined') {
            updateData.isActive = updateData.isActive ? 1 : 0;
        }
        const result = await this.roleRepository.update(id, updateData);
        console.log('Update result:', result);
        return this.findOne(id);
    }
    async remove(id) {
        const result = await this.roleRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
    }
    async getRolePermissions(roleId) {
        return this.userAccessRepository.find({
            where: { roleId }
        });
    }
    async updateRolePermissions(roleId, permissions) {
        try {
            console.log('Updating permissions for role:', roleId);
            console.log('Permissions data:', JSON.stringify(permissions, null, 2));
            await this.userAccessRepository.delete({ roleId });
            if (permissions.length > 0) {
                const userAccessEntries = permissions
                    .filter(p => p.add || p.edit || p.delete || p.view)
                    .map(permission => ({
                    roleId,
                    moduleId: permission.moduleId,
                    subModuleId: permission.subModuleId || null,
                    add: permission.add ? 1 : 0,
                    edit: permission.edit ? 1 : 0,
                    delete: permission.delete ? 1 : 0,
                    view: permission.view ? 1 : 0
                }));
                console.log('User access entries to save:', JSON.stringify(userAccessEntries, null, 2));
                if (userAccessEntries.length > 0) {
                    await this.userAccessRepository.save(userAccessEntries);
                }
            }
            console.log('Permissions updated successfully');
        }
        catch (error) {
            console.error('Error updating role permissions:', error);
            throw error;
        }
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(user_access_entity_1.UserAccess)),
    __param(2, (0, typeorm_1.InjectRepository)(module_entity_1.Module)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map