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
exports.Investigation = void 0;
const typeorm_1 = require("typeorm");
let Investigation = class Investigation {
    get isActive() {
        return this.status === '1';
    }
};
exports.Investigation = Investigation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Investigation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Investigation.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Investigation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Investigation.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Investigation.prototype, "unitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'result_type', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Investigation.prototype, "resultType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'default_value', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Investigation.prototype, "defaultValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Investigation.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 1, default: '1' }),
    __metadata("design:type", String)
], Investigation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Investigation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Investigation.prototype, "updatedAt", void 0);
exports.Investigation = Investigation = __decorate([
    (0, typeorm_1.Entity)({ name: 'lab_investigations', schema: 'public' })
], Investigation);
//# sourceMappingURL=investigation.entity.js.map