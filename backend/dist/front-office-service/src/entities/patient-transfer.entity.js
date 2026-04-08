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
exports.PatientTransfer = void 0;
const typeorm_1 = require("typeorm");
let PatientTransfer = class PatientTransfer {
};
exports.PatientTransfer = PatientTransfer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PatientTransfer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transfer_number', length: 20 }),
    __metadata("design:type", String)
], PatientTransfer.prototype, "transferNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id' }),
    __metadata("design:type", Number)
], PatientTransfer.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_location_id' }),
    __metadata("design:type", Number)
], PatientTransfer.prototype, "fromLocationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_location_id' }),
    __metadata("design:type", Number)
], PatientTransfer.prototype, "toLocationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_bed_id', nullable: true }),
    __metadata("design:type", Number)
], PatientTransfer.prototype, "fromBedId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_bed_id', nullable: true }),
    __metadata("design:type", Number)
], PatientTransfer.prototype, "toBedId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transfer_date' }),
    __metadata("design:type", Date)
], PatientTransfer.prototype, "transferDate", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], PatientTransfer.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 'pending',
        enum: ['pending', 'in_transit', 'completed', 'cancelled']
    }),
    __metadata("design:type", String)
], PatientTransfer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transferred_by' }),
    __metadata("design:type", Number)
], PatientTransfer.prototype, "transferredBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_by', nullable: true }),
    __metadata("design:type", Number)
], PatientTransfer.prototype, "receivedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PatientTransfer.prototype, "createdAt", void 0);
exports.PatientTransfer = PatientTransfer = __decorate([
    (0, typeorm_1.Entity)('patient_transfers')
], PatientTransfer);
//# sourceMappingURL=patient-transfer.entity.js.map