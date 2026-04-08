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
exports.DoctorsController = void 0;
const common_1 = require("@nestjs/common");
const doctors_service_1 = require("../services/doctors.service");
const auth_guard_1 = require("../auth/auth.guard");
let DoctorsController = class DoctorsController {
    constructor(doctorsService) {
        this.doctorsService = doctorsService;
    }
    async getDoctors(locationId) {
        return this.doctorsService.getDoctors(locationId);
    }
    async getDoctorTimeslots(locationId) {
        return this.doctorsService.getDoctorTimeslots(locationId);
    }
    async getAllDoctorTimeslots(locationId) {
        return this.doctorsService.getAllDoctorTimeslots(locationId);
    }
    async createBulkTimeslots(data) {
        console.log('POST /timeslots/bulk called with:', data);
        return this.doctorsService.createBulkTimeslots(data);
    }
    async updateTimeslotStatus(id, data) {
        return this.doctorsService.updateTimeslotStatus(id, data.isActive);
    }
    async getConsultationFees(locationId) {
        return this.doctorsService.getConsultationFees(locationId);
    }
    async createConsultationFee(data) {
        return this.doctorsService.createConsultationFee(data);
    }
    async updateConsultationFee(id, data) {
        return this.doctorsService.updateConsultationFee(id, data);
    }
    async deleteConsultationFee(id) {
        return this.doctorsService.deleteConsultationFee(id);
    }
};
exports.DoctorsController = DoctorsController;
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getDoctors", null);
__decorate([
    (0, common_1.Get)('timeslots'),
    __param(0, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getDoctorTimeslots", null);
__decorate([
    (0, common_1.Get)('timeslots/all'),
    __param(0, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getAllDoctorTimeslots", null);
__decorate([
    (0, common_1.Post)('timeslots/bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "createBulkTimeslots", null);
__decorate([
    (0, common_1.Put)('timeslots/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "updateTimeslotStatus", null);
__decorate([
    (0, common_1.Get)('consultation-fees'),
    __param(0, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getConsultationFees", null);
__decorate([
    (0, common_1.Post)('consultation-fees'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "createConsultationFee", null);
__decorate([
    (0, common_1.Put)('consultation-fees/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "updateConsultationFee", null);
__decorate([
    (0, common_1.Put)('consultation-fees/:id/delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "deleteConsultationFee", null);
exports.DoctorsController = DoctorsController = __decorate([
    (0, common_1.Controller)('doctors'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [doctors_service_1.DoctorsService])
], DoctorsController);
//# sourceMappingURL=doctors.controller.js.map