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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_access_entity_1 = require("../entities/user-access.entity");
const modules_service_1 = require("./modules.service");
let PermissionsService = class PermissionsService {
    constructor(userAccessRepository, modulesService) {
        this.userAccessRepository = userAccessRepository;
        this.modulesService = modulesService;
    }
    async getRolePermissions(roleId) {
        return this.userAccessRepository.find({ where: { roleId } });
    }
    async updateRolePermissions(roleId, permissions) {
        await this.userAccessRepository.delete({ roleId });
        const newPermissions = permissions.map(permission => this.userAccessRepository.create({ ...permission, roleId }));
        await this.userAccessRepository.save(newPermissions);
        return this.getRolePermissions(roleId);
    }
    async getModulePermissions() {
        const query = `
      SELECT DISTINCT
        m.id as module_id,
        m.name as module_name,
        m.path as module_path,
        sm.id as sub_module_id,
        sm.subcat_name as sub_module_name,
        sm.subcat_path as sub_module_path
      FROM modules m
      LEFT JOIN sub_modules sm ON m.id = sm.module_id AND sm.is_active = true
      WHERE m.is_active = true
      ORDER BY m."order", sm.id
    `;
        return this.userAccessRepository.query(query);
    }
    async getRolePermissionsWithModules(roleId) {
        const query = `
      SELECT 
        m.id as module_id,
        m.name as module_name,
        m.path as module_path,
        sm.id as sub_module_id,
        sm.subcat_name as sub_module_name,
        sm.subcat_path as sub_module_path,
        COALESCE(ua.add, 0) as can_add,
        COALESCE(ua.edit, 0) as can_edit,
        COALESCE(ua.delete, 0) as can_delete,
        COALESCE(ua.view, 0) as can_view
      FROM modules m
      LEFT JOIN sub_modules sm ON m.id = sm.module_id AND sm.is_active = true
      LEFT JOIN user_access ua ON ua.module_id = m.id 
        AND (ua.sub_module_id = sm.id OR (ua.sub_module_id IS NULL AND sm.id IS NULL))
        AND ua.role_id = $1
      WHERE m.is_active = true
      ORDER BY m."order", sm.id
    `;
        return this.userAccessRepository.query(query, [roleId]);
    }
    async getModulesWithPermissions(roleId) {
        try {
            const query = `
        SELECT 
          m.id as module_id,
          m.name as module_name,
          m.path as module_path,
          m.icon as module_icon,
          m."order" as module_order,
          m.status as module_status,
          sm.id as sub_module_id,
          sm.subcat_name as sub_module_name,
          sm.subcat_path as sub_module_path,
          sm.icon as sub_module_icon,
          COALESCE(ua.add, 0) as can_add,
          COALESCE(ua.edit, 0) as can_edit,
          COALESCE(ua.delete, 0) as can_delete,
          COALESCE(ua.view, 0) as can_view
        FROM modules m
        LEFT JOIN sub_modules sm ON m.id = sm.module_id
        LEFT JOIN user_access ua ON ua.module_id = m.id 
          AND (ua.sub_module_id = sm.id OR (ua.sub_module_id IS NULL AND sm.id IS NULL))
          AND ua.role_id = $1
        WHERE m.status = 1
        ORDER BY m."order", sm.id
      `;
            const results = await this.userAccessRepository.query(query, [roleId]);
            const modulesMap = new Map();
            results.forEach(row => {
                const moduleId = row.module_id;
                if (!modulesMap.has(moduleId)) {
                    modulesMap.set(moduleId, {
                        id: moduleId,
                        name: row.module_name,
                        path: row.module_path,
                        icon: row.module_icon,
                        order: row.module_order,
                        isActive: row.module_status === 1,
                        subModules: []
                    });
                }
                if (row.sub_module_id) {
                    modulesMap.get(moduleId).subModules.push({
                        id: row.sub_module_id,
                        name: row.sub_module_name,
                        path: row.sub_module_path,
                        icon: row.sub_module_icon,
                        moduleId: moduleId,
                        permissions: {
                            add: row.can_add || 0,
                            edit: row.can_edit || 0,
                            delete: row.can_delete || 0,
                            view: row.can_view || 0
                        }
                    });
                }
                else {
                    modulesMap.get(moduleId).permissions = {
                        add: row.can_add || 0,
                        edit: row.can_edit || 0,
                        delete: row.can_delete || 0,
                        view: row.can_view || 0
                    };
                }
            });
            return Array.from(modulesMap.values());
        }
        catch (error) {
            console.error('Error in getModulesWithPermissions:', error);
            throw error;
        }
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_access_entity_1.UserAccess)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        modules_service_1.ModulesService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map