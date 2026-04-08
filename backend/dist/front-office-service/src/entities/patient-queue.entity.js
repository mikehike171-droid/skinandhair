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
exports.PatientQueue = void 0;
const typeorm_1 = require("typeorm");
let PatientQueue = class PatientQueue {
};
exports.PatientQueue = PatientQueue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PatientQueue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id' }),
    __metadata("design:type", Number)
], PatientQueue.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id' }),
    __metadata("design:type", Number)
], PatientQueue.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'appointment_id', nullable: true }),
    __metadata("design:type", Number)
], PatientQueue.prototype, "appointmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'queue_number' }),
    __metadata("design:type", Number)
], PatientQueue.prototype, "queueNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'queue_type', length: 20 }),
    __metadata("design:type", String)
], PatientQueue.prototype, "queueType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 'waiting',
        enum: ['waiting', 'in_progress', 'completed', 'cancelled']
    }),
    __metadata("design:type", String)
], PatientQueue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_time', nullable: true }),
    __metadata("design:type", Date)
], PatientQueue.prototype, "estimatedTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_time', nullable: true }),
    __metadata("design:type", Date)
], PatientQueue.prototype, "actualTime", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PatientQueue.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PatientQueue.prototype, "updatedAt", void 0);
exports.PatientQueue = PatientQueue = __decorate([
    (0, typeorm_1.Entity)('patient_queue')
], PatientQueue);
//# sourceMappingURL=patient-queue.entity.js.map