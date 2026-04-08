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
exports.AppointmentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const appointment_service_1 = require("../services/appointment.service");
const user_location_service_1 = require("../services/user-location.service");
let AppointmentController = class AppointmentController {
    constructor(appointmentService, userLocationService) {
        this.appointmentService = appointmentService;
        this.userLocationService = userLocationService;
    }
    async getAppointments(req, fromDate, toDate, status, search, page = 1, limit = 10, queryLocationId, doctorId) {
        const locationId = queryLocationId ? parseInt(queryLocationId) : null;
        if (!locationId) {
            return { data: [], total: 0, page, limit, totalPages: 0 };
        }
        return this.appointmentService.getAppointments({
            fromDate,
            toDate,
            status,
            search,
            page: parseInt(page.toString()),
            limit: parseInt(limit.toString()),
            locationId,
            doctorId: doctorId ? parseInt(doctorId) : undefined
        });
    }
    async getMyAppointments(req, page = 1, limit = 50, fromDate, toDate) {
        const userId = req.user?.sub || req.user?.id || req.user?.userId;
        const doctorId = typeof userId === 'string' ? parseInt(userId) : userId;
        return this.appointmentService.getMyDoctorAppointments(doctorId, parseInt(page.toString()), parseInt(limit.toString()), fromDate, toDate);
    }
    async getDoctorAppointments(req, doctorId, page = 1, limit = 50) {
        return this.appointmentService.getDoctorAppointmentsWithUserDetails(parseInt(doctorId), page, limit);
    }
    async getPatientAppointments(req, patientId) {
        const userId = req.user?.sub || req.user?.id || req.user?.userId;
        const locationId = userId ? await this.userLocationService.getUserLocationId(userId) : null;
        return this.appointmentService.getPatientAppointments(patientId, locationId);
    }
    async createAppointment(req, appointmentData) {
        const userId = req.user?.sub || req.user?.id || req.user?.userId;
        if (!userId) {
            throw new Error('User ID is required');
        }
        const locationId = await this.userLocationService.getUserLocationId(userId);
        return this.appointmentService.createAppointment(appointmentData, locationId);
    }
    async updateNextCallDate(req, patientId, updateData) {
        const userId = req.user?.sub || req.user?.id || req.user?.userId;
        const locationId = await this.userLocationService.getUserLocationId(userId);
        return this.appointmentService.updateNextCallDate(parseInt(patientId), updateData.nextCallDate, userId, locationId);
    }
    async getAppointmentById(id) {
        return this.appointmentService.getAppointmentById(id);
    }
    async updateAppointment(id, updateData) {
        return this.appointmentService.updateAppointment(id, updateData);
    }
};
exports.AppointmentController = AppointmentController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all appointments' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('fromDate')),
    __param(2, (0, common_1.Query)('toDate')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('limit')),
    __param(7, (0, common_1.Query)('locationId')),
    __param(8, (0, common_1.Query)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointments", null);
__decorate([
    (0, common_1.Get)('my-appointments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get logged-in doctor appointments' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('fromDate')),
    __param(4, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getMyAppointments", null);
__decorate([
    (0, common_1.Get)('doctor/:doctorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor appointments with user details' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('doctorId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getDoctorAppointments", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient appointments' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getPatientAppointments", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new appointment' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "createAppointment", null);
__decorate([
    (0, common_1.Put)('next-call-date/:patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update next call date for patient' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('patientId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "updateNextCallDate", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get appointment by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "getAppointmentById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update appointment' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentController.prototype, "updateAppointment", null);
exports.AppointmentController = AppointmentController = __decorate([
    (0, swagger_1.ApiTags)('Appointments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [appointment_service_1.AppointmentService,
        user_location_service_1.UserLocationService])
], AppointmentController);
//# sourceMappingURL=appointment.controller.js.map