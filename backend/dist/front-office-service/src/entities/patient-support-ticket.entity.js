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
exports.PatientSupportTicket = void 0;
const typeorm_1 = require("typeorm");
let PatientSupportTicket = class PatientSupportTicket {
};
exports.PatientSupportTicket = PatientSupportTicket;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PatientSupportTicket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_number', length: 20 }),
    __metadata("design:type", String)
], PatientSupportTicket.prototype, "ticketNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id' }),
    __metadata("design:type", Number)
], PatientSupportTicket.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id' }),
    __metadata("design:type", Number)
], PatientSupportTicket.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], PatientSupportTicket.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], PatientSupportTicket.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 'medium',
        enum: ['low', 'medium', 'high', 'urgent']
    }),
    __metadata("design:type", String)
], PatientSupportTicket.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 'open',
        enum: ['open', 'in_progress', 'resolved', 'closed']
    }),
    __metadata("design:type", String)
], PatientSupportTicket.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_to', nullable: true }),
    __metadata("design:type", Number)
], PatientSupportTicket.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PatientSupportTicket.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PatientSupportTicket.prototype, "updatedAt", void 0);
exports.PatientSupportTicket = PatientSupportTicket = __decorate([
    (0, typeorm_1.Entity)('patient_support_tickets')
], PatientSupportTicket);
//# sourceMappingURL=patient-support-ticket.entity.js.map