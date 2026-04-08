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
exports.PatientPrescription = void 0;
const typeorm_1 = require("typeorm");
let PatientPrescription = class PatientPrescription {
};
exports.PatientPrescription = PatientPrescription;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PatientPrescription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id' }),
    __metadata("design:type", Number)
], PatientPrescription.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vitals_temperature', type: 'decimal', precision: 4, scale: 1, nullable: true }),
    __metadata("design:type", Number)
], PatientPrescription.prototype, "vitalsTemperature", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vitals_blood_pressure', length: 20, nullable: true }),
    __metadata("design:type", String)
], PatientPrescription.prototype, "vitalsBloodPressure", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vitals_heart_rate', nullable: true }),
    __metadata("design:type", Number)
], PatientPrescription.prototype, "vitalsHeartRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vitals_o2_saturation', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], PatientPrescription.prototype, "vitalsO2Saturation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vitals_respiratory_rate', nullable: true }),
    __metadata("design:type", Number)
], PatientPrescription.prototype, "vitalsRespiratoryRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vitals_weight', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], PatientPrescription.prototype, "vitalsWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vitals_height', nullable: true }),
    __metadata("design:type", Number)
], PatientPrescription.prototype, "vitalsHeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vitals_blood_glucose', nullable: true }),
    __metadata("design:type", Number)
], PatientPrescription.prototype, "vitalsBloodGlucose", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vitals_pain_scale', nullable: true }),
    __metadata("design:type", Number)
], PatientPrescription.prototype, "vitalsPainScale", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nursing_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PatientPrescription.prototype, "nursingNotes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PatientPrescription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PatientPrescription.prototype, "updatedAt", void 0);
exports.PatientPrescription = PatientPrescription = __decorate([
    (0, typeorm_1.Entity)('patient_prescriptions')
], PatientPrescription);
//# sourceMappingURL=patient-prescription.entity.js.map