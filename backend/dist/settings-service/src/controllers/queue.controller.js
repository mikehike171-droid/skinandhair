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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const queue_service_1 = require("../services/queue.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let QueueController = class QueueController {
    constructor(queueService) {
        this.queueService = queueService;
    }
    async getDoctorsByDepartment(locationId) {
        if (!locationId)
            return { doctorsByDepartment: {} };
        return this.queueService.getDoctorsByDepartment(locationId);
    }
    async getQueueAppointments(locationId) {
        if (!locationId)
            return { doctors: [] };
        return this.queueService.getQueueAppointments(locationId);
    }
    async updateAppointmentStatus(id, body) {
        return this.queueService.updateAppointmentStatus(id, body.status);
    }
    async testQueue() {
        return { message: 'Queue API is working', timestamp: new Date().toISOString() };
    }
    streamQueueUpdates(locationId) {
        return this.queueService.queueUpdateSubject.asObservable().pipe((0, operators_1.filter)(event => !locationId || event.locationId === Number(locationId)), (0, operators_1.map)(() => ({ data: { timestamp: new Date().toISOString() } })));
    }
};
exports.QueueController = QueueController;
__decorate([
    (0, common_1.Get)('doctors'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctors by department with attendance status' }),
    (0, swagger_1.ApiQuery)({ name: 'location_id', required: false, type: Number }),
    __param(0, (0, common_1.Query)('location_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "getDoctorsByDepartment", null);
__decorate([
    (0, common_1.Get)('appointments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get today appointments for queue display grouped by doctor' }),
    (0, swagger_1.ApiQuery)({ name: 'location_id', required: false, type: Number }),
    __param(0, (0, common_1.Query)('location_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "getQueueAppointments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Put)('appointments/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update appointment queue status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "updateAppointmentStatus", null);
__decorate([
    (0, common_1.Get)('test'),
    (0, swagger_1.ApiOperation)({ summary: 'Test queue API endpoint' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QueueController.prototype, "testQueue", null);
__decorate([
    (0, common_1.Sse)('stream'),
    (0, swagger_1.ApiOperation)({ summary: 'Server-Sent Events stream for real-time queue updates' }),
    (0, swagger_1.ApiQuery)({ name: 'location_id', required: false, type: Number }),
    __param(0, (0, common_1.Query)('location_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", rxjs_1.Observable)
], QueueController.prototype, "streamQueueUpdates", null);
exports.QueueController = QueueController = __decorate([
    (0, swagger_1.ApiTags)('Queue'),
    (0, common_1.Controller)('queue'),
    __metadata("design:paramtypes", [queue_service_1.QueueService])
], QueueController);
//# sourceMappingURL=queue.controller.js.map