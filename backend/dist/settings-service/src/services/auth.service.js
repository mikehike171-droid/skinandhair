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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../entities/user.entity");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: loginDto.username }
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            if (!user.isActive) {
                throw new common_1.UnauthorizedException('Account is deactivated. Please contact administrator.');
            }
            const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const superAdminCheck = await this.userRepository.query('SELECT role_id FROM user_location_permissions WHERE user_id = $1 AND location_id IS NULL AND department_id IS NULL', [user.id]);
            const isAdmin = superAdminCheck.length > 0;
            if (!isAdmin && loginDto.userIp && loginDto.userIp !== '127.0.0.1' && loginDto.userIp !== '::1') {
                const ipCheck = await this.userRepository.query(`SELECT li.*, l.name as location_name 
           FROM "locationsIp" li 
           LEFT JOIN locations l ON l.id = li.location_id 
           WHERE li.ip = $1 AND li.status = 'active'`, [loginDto.userIp]);
                if (ipCheck.length === 0) {
                    throw new common_1.UnauthorizedException('Your WiFi is not registered. Contact IT team');
                }
            }
            let userRoleId = null;
            let userRoleName = null;
            let userDepartmentId = null;
            let userLocationIds = '';
            let isSuperAdmin = false;
            let primaryLocationResult = [];
            try {
                const userPermissionsCheck = await this.userRepository.query('SELECT COUNT(*) as count FROM user_location_permissions WHERE user_id = $1', [user.id]);
                const superAdminCheck = await this.userRepository.query('SELECT role_id FROM user_location_permissions WHERE user_id = $1 AND location_id IS NULL AND department_id IS NULL', [user.id]);
                if (superAdminCheck.length > 0) {
                    isSuperAdmin = true;
                    userRoleId = superAdminCheck[0].role_id;
                    userDepartmentId = null;
                    userLocationIds = '';
                }
                else if (userPermissionsCheck[0].count > 0) {
                    primaryLocationResult = await this.userRepository.query('SELECT role_id, department_id FROM user_location_permissions WHERE user_id = $1 AND location_id = $2', [user.id, user.primaryLocationId]);
                    if (primaryLocationResult.length > 0) {
                        userRoleId = primaryLocationResult[0].role_id;
                        userDepartmentId = primaryLocationResult[0].department_id;
                    }
                    const locationResult = await this.userRepository.query('SELECT location_id FROM user_location_permissions WHERE user_id = $1', [user.id]);
                    userLocationIds = locationResult.map(row => row.location_id).join(',');
                }
                else {
                    throw new common_1.UnauthorizedException('User permissions not configured. Please contact administrator.');
                }
            }
            catch (locationError) {
                console.error('Location query error:', locationError);
                console.error('Error details:', {
                    message: locationError.message,
                    stack: locationError.stack,
                    userId: user.id,
                    primaryLocationId: user.primaryLocationId
                });
                throw new common_1.InternalServerErrorException('Failed to get user permissions');
            }
            let menuData = [];
            let sidemenu = [];
            let moduleAccess = [];
            try {
                let menuQuery;
                let queryParams;
                if (isSuperAdmin) {
                    menuQuery = `
            SELECT DISTINCT
              m.id as module_id,
              m.path as module_path,
              m.name as module_name,
              m.icon as module_icon,
              m."order" as module_order,
              sm.id as sub_module_id,
              sm.subcat_name as sub_module_name,
              sm.subcat_path as sub_module_path,
              sm.icon as sub_module_icon,
              1 as can_add,
              1 as can_edit,
              1 as can_delete,
              1 as can_view
            FROM modules m
            LEFT JOIN sub_modules sm ON m.id = sm.module_id
            WHERE m.status = 1
            ORDER BY m."order", sm.id
          `;
                    queryParams = [];
                }
                else {
                    menuQuery = `
            SELECT DISTINCT
              m.id as module_id,
              m.path as module_path,
              m.name as module_name,
              m.icon as module_icon,
              m."order" as module_order,
              sm.id as sub_module_id,
              sm.subcat_name as sub_module_name,
              sm.subcat_path as sub_module_path,
              sm.icon as sub_module_icon,
              ua.add as can_add,
              ua.edit as can_edit,
              ua.delete as can_delete,
              ua.view as can_view
            FROM modules m
            LEFT JOIN sub_modules sm ON m.id = sm.module_id
            LEFT JOIN user_access ua ON ua.module_id = m.id AND (ua.sub_module_id = sm.id OR (ua.sub_module_id IS NULL AND sm.id IS NULL))
            WHERE ua.role_id = $1 AND ua.view = 1 AND m.status = 1
            ORDER BY m."order", sm.id
          `;
                    queryParams = [userRoleId];
                }
                menuData = await this.userRepository.query(menuQuery, queryParams);
                if (menuData.length === 0) {
                    const accessCheck = await this.userRepository.query('SELECT * FROM user_access WHERE role_id = $1 LIMIT 5', [userRoleId]);
                }
            }
            catch (menuError) {
                console.error('Menu query failed:', menuError.message);
                console.error('Menu query stack:', menuError.stack);
                sidemenu = [];
                moduleAccess = [];
            }
            if (menuData.length > 0) {
                const moduleMap = new Map();
                moduleAccess = [];
                menuData.forEach(row => {
                    const moduleId = row.module_id;
                    if (!moduleMap.has(moduleId)) {
                        moduleMap.set(moduleId, {
                            id: moduleId,
                            path: row.module_path,
                            name: row.module_name,
                            icon: row.module_icon,
                            sub_menu: []
                        });
                    }
                    if (row.sub_module_id && row.sub_module_id !== null) {
                        const existingSubmenu = moduleMap.get(moduleId).sub_menu.find(sub => sub.id === row.sub_module_id);
                        if (!existingSubmenu) {
                            moduleMap.get(moduleId).sub_menu.push({
                                id: row.sub_module_id,
                                path: row.sub_module_path,
                                name: row.sub_module_name,
                                icon: row.sub_module_icon,
                                add: row.can_add || 0,
                                edit: row.can_edit || 0,
                                delete: row.can_delete || 0,
                                view: row.can_view || 0
                            });
                        }
                        const existingSubAccess = moduleAccess.find(ma => ma.module_path === row.sub_module_path);
                        if (!existingSubAccess) {
                            moduleAccess.push({
                                module_path: row.sub_module_path,
                                module_name: row.sub_module_name,
                                add: row.can_add || 0,
                                edit: row.can_edit || 0,
                                delete: row.can_delete || 0,
                                view: row.can_view || 0
                            });
                        }
                    }
                    const existingAccess = moduleAccess.find(ma => ma.module_path === row.module_path);
                    if (!existingAccess) {
                        moduleAccess.push({
                            module_path: row.module_path,
                            module_name: row.module_name,
                            add: row.can_add || 0,
                            edit: row.can_edit || 0,
                            delete: row.can_delete || 0,
                            view: row.can_view || 0
                        });
                    }
                });
                sidemenu = Array.from(moduleMap.values()).map(module => ({
                    menu: module
                }));
            }
            else {
            }
            if (userRoleId) {
                try {
                    const roleResult = await this.userRepository.query('SELECT name FROM roles WHERE id = $1', [userRoleId]);
                    if (roleResult.length > 0) {
                        userRoleName = roleResult[0].name;
                    }
                }
                catch (roleError) {
                    console.error('Role query error:', roleError);
                }
            }
            const result = {
                data: {
                    access_token: this.jwtService.sign({
                        username: user.username,
                        sub: user.id,
                        role_id: userRoleId,
                        location_id: userLocationIds,
                        department_id: userDepartmentId
                    }),
                    UserInfo: {
                        id: user.id,
                        user_name: user.username,
                        email: user.email,
                        role_id: userRoleId,
                        role_name: userRoleName,
                        department_id: userDepartmentId,
                        primary_location_id: user.primaryLocationId,
                        location_id: userLocationIds,
                        phone_number: user.phone
                    },
                    sidemenu,
                    moduleAccess
                }
            };
            return result;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error('Login error:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('Error name:', error.name);
            throw new common_1.InternalServerErrorException('Login failed due to server error');
        }
    }
    async switchLocation(userId, locationId) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId }
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            await this.userRepository.query('UPDATE users SET primary_location_id = $1 WHERE id = $2', [locationId, userId]);
            let userRoleId = null;
            let userRoleName = null;
            let userDepartmentId = null;
            let userLocationIds = '';
            let isSuperAdmin = false;
            try {
                const userPermissionsCheck = await this.userRepository.query('SELECT COUNT(*) as count FROM user_location_permissions WHERE user_id = $1', [userId]);
                const superAdminCheck = await this.userRepository.query('SELECT role_id FROM user_location_permissions WHERE user_id = $1 AND location_id IS NULL AND department_id IS NULL', [userId]);
                if (superAdminCheck.length > 0) {
                    isSuperAdmin = true;
                    userRoleId = superAdminCheck[0].role_id;
                    userDepartmentId = null;
                    userLocationIds = '';
                }
                else {
                    const locationResult = await this.userRepository.query('SELECT role_id, department_id FROM user_location_permissions WHERE user_id = $1 AND location_id = $2', [userId, locationId]);
                    if (locationResult.length > 0) {
                        userRoleId = locationResult[0].role_id;
                        userDepartmentId = locationResult[0].department_id;
                    }
                    const allLocationsResult = await this.userRepository.query('SELECT location_id FROM user_location_permissions WHERE user_id = $1', [userId]);
                    userLocationIds = allLocationsResult.map(row => row.location_id).join(',');
                }
            }
            catch (locationError) {
                console.error('Location query error:', locationError);
                throw new common_1.InternalServerErrorException('Failed to get location permissions');
            }
            let menuData = [];
            let sidemenu = [];
            let moduleAccess = [];
            try {
                let menuQuery;
                let queryParams;
                if (isSuperAdmin) {
                    menuQuery = `
            SELECT DISTINCT
              m.id as module_id,
              m.path as module_path,
              m.name as module_name,
              m.icon as module_icon,
              m."order" as module_order,
              sm.id as sub_module_id,
              sm.subcat_name as sub_module_name,
              sm.subcat_path as sub_module_path,
              sm.icon as sub_module_icon,
              1 as can_add,
              1 as can_edit,
              1 as can_delete,
              1 as can_view
            FROM modules m
            LEFT JOIN sub_modules sm ON m.id = sm.module_id
            WHERE m.status = 1
            ORDER BY m."order", sm.id
          `;
                    queryParams = [];
                }
                else {
                    menuQuery = `
            SELECT DISTINCT
              m.id as module_id,
              m.path as module_path,
              m.name as module_name,
              m.icon as module_icon,
              m."order" as module_order,
              sm.id as sub_module_id,
              sm.subcat_name as sub_module_name,
              sm.subcat_path as sub_module_path,
              sm.icon as sub_module_icon,
              ua.add as can_add,
              ua.edit as can_edit,
              ua.delete as can_delete,
              ua.view as can_view
            FROM modules m
            LEFT JOIN sub_modules sm ON m.id = sm.module_id
            LEFT JOIN user_access ua ON ua.module_id = m.id AND (ua.sub_module_id = sm.id OR (ua.sub_module_id IS NULL AND sm.id IS NULL))
            WHERE ua.role_id = $1 AND ua.view = 1 AND m.status = 1
            ORDER BY m."order", sm.id
          `;
                    queryParams = [userRoleId];
                }
                menuData = await this.userRepository.query(menuQuery, queryParams);
                if (menuData.length > 0) {
                    const moduleMap = new Map();
                    moduleAccess = [];
                    menuData.forEach(row => {
                        const moduleId = row.module_id;
                        if (!moduleMap.has(moduleId)) {
                            moduleMap.set(moduleId, {
                                id: moduleId,
                                path: row.module_path,
                                name: row.module_name,
                                icon: row.module_icon,
                                sub_menu: []
                            });
                        }
                        if (row.sub_module_id && row.sub_module_id !== null) {
                            const existingSubmenu = moduleMap.get(moduleId).sub_menu.find(sub => sub.id === row.sub_module_id);
                            if (!existingSubmenu) {
                                moduleMap.get(moduleId).sub_menu.push({
                                    id: row.sub_module_id,
                                    path: row.sub_module_path,
                                    name: row.sub_module_name,
                                    icon: row.sub_module_icon,
                                    add: row.can_add || 0,
                                    edit: row.can_edit || 0,
                                    delete: row.can_delete || 0,
                                    view: row.can_view || 0
                                });
                            }
                            const existingSubAccess = moduleAccess.find(ma => ma.module_path === row.sub_module_path);
                            if (!existingSubAccess) {
                                moduleAccess.push({
                                    module_path: row.sub_module_path,
                                    module_name: row.sub_module_name,
                                    add: row.can_add || 0,
                                    edit: row.can_edit || 0,
                                    delete: row.can_delete || 0,
                                    view: row.can_view || 0
                                });
                            }
                        }
                        const existingAccess = moduleAccess.find(ma => ma.module_path === row.module_path);
                        if (!existingAccess) {
                            moduleAccess.push({
                                module_path: row.module_path,
                                module_name: row.module_name,
                                add: row.can_add || 0,
                                edit: row.can_edit || 0,
                                delete: row.can_delete || 0,
                                view: row.can_view || 0
                            });
                        }
                    });
                    sidemenu = Array.from(moduleMap.values()).map(module => ({
                        menu: module
                    }));
                }
            }
            catch (menuError) {
                console.error('Menu query failed:', menuError.message);
                sidemenu = [];
                moduleAccess = [];
            }
            if (userRoleId) {
                try {
                    const roleResult = await this.userRepository.query('SELECT name FROM roles WHERE id = $1', [userRoleId]);
                    if (roleResult.length > 0) {
                        userRoleName = roleResult[0].name;
                    }
                }
                catch (roleError) {
                    console.error('Role query error:', roleError);
                }
            }
            return {
                UserInfo: {
                    id: user.id,
                    user_name: user.username,
                    email: user.email,
                    role_id: userRoleId,
                    role_name: userRoleName,
                    department_id: userDepartmentId,
                    primary_location_id: locationId,
                    location_id: userLocationIds,
                    phone_number: user.phone
                },
                sidemenu,
                moduleAccess
            };
        }
        catch (error) {
            console.error('Switch location error:', error);
            throw new common_1.InternalServerErrorException('Failed to switch location');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map