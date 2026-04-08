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
exports.CallHistory = void 0;
const typeorm_1 = require("typeorm");
let CallHistory = class CallHistory {
};
exports.CallHistory = CallHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CallHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mobile_number_id', nullable: true }),
    __metadata("design:type", Number)
], CallHistory.prototype, "mobileNumberId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", Number)
], CallHistory.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id', nullable: true }),
    __metadata("design:type", String)
], CallHistory.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id', nullable: true }),
    __metadata("design:type", Number)
], CallHistory.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_call_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], CallHistory.prototype, "nextCallDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'caller_by', nullable: true }),
    __metadata("design:type", String)
], CallHistory.prototype, "callerBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_feeling', nullable: true }),
    __metadata("design:type", String)
], CallHistory.prototype, "patientFeeling", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CallHistory.prototype, "disposition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CallHistory.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CallHistory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CallHistory.prototype, "updatedAt", void 0);
exports.CallHistory = CallHistory = __decorate([
    (0, typeorm_1.Entity)('call_history')
], CallHistory);
//# sourceMappingURL=call-history.entity.js.map