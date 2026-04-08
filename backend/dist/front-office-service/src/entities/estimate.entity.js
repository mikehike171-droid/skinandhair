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
exports.Estimate = void 0;
const typeorm_1 = require("typeorm");
const location_entity_1 = require("./location.entity");
const estimate_item_entity_1 = require("./estimate-item.entity");
let Estimate = class Estimate {
};
exports.Estimate = Estimate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Estimate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimate_number', length: 20 }),
    __metadata("design:type", String)
], Estimate.prototype, "estimateNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id' }),
    __metadata("design:type", Number)
], Estimate.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id', nullable: true }),
    __metadata("design:type", Number)
], Estimate.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], Estimate.prototype, "patientName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_phone', length: 15, nullable: true }),
    __metadata("design:type", String)
], Estimate.prototype, "patientPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Estimate.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Estimate.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_amount', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Estimate.prototype, "netAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valid_until', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Estimate.prototype, "validUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 'draft',
        enum: ['draft', 'sent', 'accepted', 'rejected', 'expired']
    }),
    __metadata("design:type", String)
], Estimate.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", Number)
], Estimate.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Estimate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Estimate.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_entity_1.Location),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    __metadata("design:type", location_entity_1.Location)
], Estimate.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => estimate_item_entity_1.EstimateItem, estimateItem => estimateItem.estimate),
    __metadata("design:type", Array)
], Estimate.prototype, "items", void 0);
exports.Estimate = Estimate = __decorate([
    (0, typeorm_1.Entity)('estimates')
], Estimate);
//# sourceMappingURL=estimate.entity.js.map