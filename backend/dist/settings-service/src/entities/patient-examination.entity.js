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
exports.PatientExamination = void 0;
const typeorm_1 = require("typeorm");
let PatientExamination = class PatientExamination {
};
exports.PatientExamination = PatientExamination;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PatientExamination.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id' }),
    __metadata("design:type", Number)
], PatientExamination.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id' }),
    __metadata("design:type", Number)
], PatientExamination.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'past_medical_reports', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PatientExamination.prototype, "pastMedicalReports", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'investigations_required', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PatientExamination.prototype, "investigationsRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'physical_examination', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PatientExamination.prototype, "physicalExamination", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PatientExamination.prototype, "bp", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PatientExamination.prototype, "pulse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'heart_rate', nullable: true }),
    __metadata("design:type", String)
], PatientExamination.prototype, "heartRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PatientExamination.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PatientExamination.prototype, "rr", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'menstrual_obstetric_history', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PatientExamination.prototype, "menstrualObstetricHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PatientExamination.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'treatment_plan_months_doctor', nullable: true }),
    __metadata("design:type", Number)
], PatientExamination.prototype, "treatmentPlanMonthsDoctor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_renewal_date_doctor', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PatientExamination.prototype, "nextRenewalDateDoctor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'treatment_plan_months_pro', nullable: true }),
    __metadata("design:type", Number)
], PatientExamination.prototype, "treatmentPlanMonthsPro", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_renewal_date_pro', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PatientExamination.prototype, "nextRenewalDatePro", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PatientExamination.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PatientExamination.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paid_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PatientExamination.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'due_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PatientExamination.prototype, "dueAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", Number)
], PatientExamination.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PatientExamination.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PatientExamination.prototype, "updatedAt", void 0);
exports.PatientExamination = PatientExamination = __decorate([
    (0, typeorm_1.Entity)('patient_examination')
], PatientExamination);
//# sourceMappingURL=patient-examination.entity.js.map