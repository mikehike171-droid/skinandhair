"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_controller_1 = require("./controllers/users.controller");
const roles_controller_1 = require("./controllers/roles.controller");
const permissions_controller_1 = require("./controllers/permissions.controller");
const modules_controller_1 = require("./controllers/modules.controller");
const departments_controller_1 = require("./controllers/departments.controller");
const locations_controller_1 = require("./controllers/locations.controller");
const masters_controller_1 = require("./controllers/masters.controller");
const users_service_1 = require("./services/users.service");
const roles_service_1 = require("./services/roles.service");
const permissions_service_1 = require("./services/permissions.service");
const modules_service_1 = require("./services/modules.service");
const departments_service_1 = require("./services/departments.service");
const locations_service_1 = require("./services/locations.service");
const user_entity_1 = require("./entities/user.entity");
const user_info_entity_1 = require("./entities/user-info.entity");
const role_entity_1 = require("./entities/role.entity");
const module_entity_1 = require("./entities/module.entity");
const sub_module_entity_1 = require("./entities/sub-module.entity");
const user_access_entity_1 = require("./entities/user-access.entity");
const department_entity_1 = require("./entities/department.entity");
const location_entity_1 = require("./entities/location.entity");
let SettingsModule = class SettingsModule {
};
exports.SettingsModule = SettingsModule;
exports.SettingsModule = SettingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                user_info_entity_1.UserInfo,
                role_entity_1.Role,
                module_entity_1.Module,
                sub_module_entity_1.SubModule,
                user_access_entity_1.UserAccess,
                department_entity_1.Department,
                location_entity_1.Location,
            ]),
        ],
        controllers: [
            users_controller_1.UsersController,
            roles_controller_1.RolesController,
            permissions_controller_1.PermissionsController,
            modules_controller_1.ModulesController,
            departments_controller_1.DepartmentsController,
            locations_controller_1.LocationsController,
            masters_controller_1.MastersController,
        ],
        providers: [
            users_service_1.UsersService,
            roles_service_1.RolesService,
            permissions_service_1.PermissionsService,
            modules_service_1.ModulesService,
            departments_service_1.DepartmentsService,
            locations_service_1.LocationsService,
        ],
        exports: [
            users_service_1.UsersService,
            roles_service_1.RolesService,
            permissions_service_1.PermissionsService,
            modules_service_1.ModulesService,
            departments_service_1.DepartmentsService,
            locations_service_1.LocationsService,
        ],
    })
], SettingsModule);
//# sourceMappingURL=settings.module.js.map