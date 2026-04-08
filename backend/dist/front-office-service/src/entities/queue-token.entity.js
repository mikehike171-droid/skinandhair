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
exports.QueueToken = void 0;
const typeorm_1 = require("typeorm");
const location_entity_1 = require("./location.entity");
let QueueToken = class QueueToken {
};
exports.QueueToken = QueueToken;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], QueueToken.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'token_number', length: 20 }),
    __metadata("design:type", String)
], QueueToken.prototype, "tokenNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id' }),
    __metadata("design:type", Number)
], QueueToken.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'appointment_id', nullable: true }),
    __metadata("design:type", Number)
], QueueToken.prototype, "appointmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], QueueToken.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'priority_level', default: 1 }),
    __metadata("design:type", Number)
], QueueToken.prototype, "priorityLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_wait_time', nullable: true }),
    __metadata("design:type", Number)
], QueueToken.prototype, "estimatedWaitTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 'waiting',
        enum: ['waiting', 'called', 'completed', 'cancelled']
    }),
    __metadata("design:type", String)
], QueueToken.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id' }),
    __metadata("design:type", Number)
], QueueToken.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], QueueToken.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'called_at', nullable: true }),
    __metadata("design:type", Date)
], QueueToken.prototype, "calledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', nullable: true }),
    __metadata("design:type", Date)
], QueueToken.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_entity_1.Location),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    __metadata("design:type", location_entity_1.Location)
], QueueToken.prototype, "location", void 0);
exports.QueueToken = QueueToken = __decorate([
    (0, typeorm_1.Entity)('queue_tokens')
], QueueToken);
//# sourceMappingURL=queue-token.entity.js.map