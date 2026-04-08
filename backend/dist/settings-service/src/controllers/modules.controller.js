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
exports.ModulesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const modules_service_1 = require("../services/modules.service");
const module_entity_1 = require("../entities/module.entity");
const sub_module_entity_1 = require("../entities/sub-module.entity");
let ModulesController = class ModulesController {
    constructor(modulesService) {
        this.modulesService = modulesService;
    }
    findAllModules(includeSubModules, locationId) {
        if (includeSubModules === 'true') {
            return this.modulesService.findModulesWithSubModules();
        }
        return this.modulesService.findModulesWithSubModules();
    }
    findAllSubModules() {
        return this.modulesService.findAllSubModules();
    }
    async findModulesWithSubModules() {
        try {
            return await this.modulesService.findModulesWithSubModules();
        }
        catch (error) {
            console.error('Error in findModulesWithSubModules:', error);
            throw error;
        }
    }
    createModule(createModuleDto) {
        return this.modulesService.createModule(createModuleDto);
    }
    createSubModule(createSubModuleDto) {
        return this.modulesService.createSubModule(createSubModuleDto);
    }
    updateModule(id, updateModuleDto) {
        return this.modulesService.updateModule(+id, updateModuleDto);
    }
    removeModule(id) {
        return this.modulesService.deleteModule(+id);
    }
};
exports.ModulesController = ModulesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all modules' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [module_entity_1.Module] }),
    __param(0, (0, common_1.Query)('includeSubModules')),
    __param(1, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ModulesController.prototype, "findAllModules", null);
__decorate([
    (0, common_1.Get)('sub-modules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all sub-modules' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [sub_module_entity_1.SubModule] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "findAllSubModules", null);
__decorate([
    (0, common_1.Get)('with-sub-modules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get modules with sub-modules hierarchy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "findModulesWithSubModules", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new module' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: module_entity_1.Module }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "createModule", null);
__decorate([
    (0, common_1.Post)('sub-modules'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new sub-module' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: sub_module_entity_1.SubModule }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "createSubModule", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update module' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: module_entity_1.Module }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "updateModule", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete module' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModulesController.prototype, "removeModule", null);
exports.ModulesController = ModulesController = __decorate([
    (0, swagger_1.ApiTags)('Settings - Modules'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('settings/modules'),
    __metadata("design:paramtypes", [modules_service_1.ModulesService])
], ModulesController);
//# sourceMappingURL=modules.controller.js.map