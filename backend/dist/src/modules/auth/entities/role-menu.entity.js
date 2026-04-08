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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleMenu = void 0;
const typeorm_1 = require("typeorm");
const role_entity_1 = require("./role.entity");
const menu_entity_1 = require("./menu.entity");
let RoleMenu = class RoleMenu {
};
exports.RoleMenu = RoleMenu;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RoleMenu.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RoleMenu.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RoleMenu.prototype, "menu_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", role_entity_1.Role)
], RoleMenu.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_entity_1.Menu),
    (0, typeorm_1.JoinColumn)({ name: 'menu_id' }),
    __metadata("design:type", menu_entity_1.Menu)
], RoleMenu.prototype, "menu", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], RoleMenu.prototype, "created_at", void 0);
exports.RoleMenu = RoleMenu = __decorate([
    (0, typeorm_1.Entity)('role_menus')
], RoleMenu);
//# sourceMappingURL=role-menu.entity.js.map