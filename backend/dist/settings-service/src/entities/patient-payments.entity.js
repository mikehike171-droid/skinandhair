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
exports.PatientPayments = void 0;
const typeorm_1 = require("typeorm");
const patient_examination_entity_1 = require("./patient-examination.entity");
let PatientPayments = class PatientPayments {
};
exports.PatientPayments = PatientPayments;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PatientPayments.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_examination_id' }),
    __metadata("design:type", Number)
], PatientPayments.prototype, "patientExaminationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_method' }),
    __metadata("design:type", String)
], PatientPayments.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PatientPayments.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PatientPayments.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PatientPayments.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_examination_entity_1.PatientExamination),
    (0, typeorm_1.JoinColumn)({ name: 'patient_examination_id' }),
    __metadata("design:type", patient_examination_entity_1.PatientExamination)
], PatientPayments.prototype, "patientExamination", void 0);
exports.PatientPayments = PatientPayments = __decorate([
    (0, typeorm_1.Entity)('patient_payments')
], PatientPayments);
//# sourceMappingURL=patient-payments.entity.js.map