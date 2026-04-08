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
exports.UserInfo = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UserInfo = class UserInfo {
};
exports.UserInfo = UserInfo;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'user_id' }),
    __metadata("design:type", Number)
], UserInfo.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], UserInfo.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_type', type: 'varchar', length: 10, default: 'staff' }),
    __metadata("design:type", String)
], UserInfo.prototype, "userType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alternate_phone', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], UserInfo.prototype, "alternatePhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address', type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserInfo.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pincode', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], UserInfo.prototype, "pincode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qualification', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], UserInfo.prototype, "qualification", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'years_of_experience', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], UserInfo.prototype, "yearsOfExperience", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'medical_registration_number', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], UserInfo.prototype, "medicalRegistrationNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registration_council', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], UserInfo.prototype, "registrationCouncil", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registration_valid_until', type: 'date', nullable: true }),
    __metadata("design:type", String)
], UserInfo.prototype, "registrationValidUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'license_copy', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], UserInfo.prototype, "licenseCopy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'degree_certificates', type: 'text', nullable: true }),
    __metadata("design:type", String)
], UserInfo.prototype, "degreeCertificates", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employment_type', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], UserInfo.prototype, "employmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'joining_date', type: 'date', nullable: true }),
    __metadata("design:type", String)
], UserInfo.prototype, "joiningDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserInfo.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], UserInfo.prototype, "updatedAt", void 0);
exports.UserInfo = UserInfo = __decorate([
    (0, typeorm_1.Entity)('user_info')
], UserInfo);
//# sourceMappingURL=user-info.entity.js.map