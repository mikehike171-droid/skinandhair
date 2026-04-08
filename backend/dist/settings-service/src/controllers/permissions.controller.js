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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const permissions_service_1 = require("../services/permissions.service");
const user_access_entity_1 = require("../entities/user-access.entity");
let PermissionsController = class PermissionsController {
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    getModulePermissions() {
        return this.permissionsService.getModulePermissions();
    }
    getRolePermissions(roleId) {
        return this.permissionsService.getRolePermissions(+roleId);
    }
    getRolePermissionsWithModules(roleId) {
        return this.permissionsService.getRolePermissionsWithModules(+roleId);
    }
    getModulesWithPermissions(roleId) {
        return this.permissionsService.getModulesWithPermissions(+roleId);
    }
    updateRolePermissions(roleId, permissions) {
        return this.permissionsService.updateRolePermissions(+roleId, permissions);
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Get)('modules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all modules and sub-modules' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "getModulePermissions", null);
__decorate([
    (0, common_1.Get)('role/:roleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get role permissions' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [user_access_entity_1.UserAccess] }),
    __param(0, (0, common_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getRolePermissions", null);
__decorate([
    (0, common_1.Get)('role/:roleId/with-modules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get role permissions with module details' }),
    __param(0, (0, common_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "getRolePermissionsWithModules", null);
__decorate([
    (0, common_1.Get)('modules-with-permissions/:roleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get modules with submodules and role permissions' }),
    __param(0, (0, common_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "getModulesWithPermissions", null);
__decorate([
    (0, common_1.Post)('role/:roleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update role permissions' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [user_access_entity_1.UserAccess] }),
    __param(0, (0, common_1.Param)('roleId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "updateRolePermissions", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, swagger_1.ApiTags)('Settings - Permissions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('settings/permissions'),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map