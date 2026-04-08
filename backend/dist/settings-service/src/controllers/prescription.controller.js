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
exports.PrescriptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const prescription_service_1 = require("../services/prescription.service");
const user_location_service_1 = require("../services/user-location.service");
let PrescriptionController = class PrescriptionController {
    constructor(prescriptionService, userLocationService) {
        this.prescriptionService = prescriptionService;
        this.userLocationService = userLocationService;
    }
    async getPatientPrescriptions(patientId, req) {
        return this.prescriptionService.getPatientPrescriptions(patientId, req.user);
    }
    async savePatientPrescriptions(data, req) {
        return this.prescriptionService.savePatientPrescriptions(data, req.user);
    }
    async deletePatientPrescription(id, req) {
        return this.prescriptionService.deletePatientPrescription(parseInt(id), req.user);
    }
};
exports.PrescriptionController = PrescriptionController;
__decorate([
    (0, common_1.Get)('patient-prescriptions/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "getPatientPrescriptions", null);
__decorate([
    (0, common_1.Post)('patient-prescriptions'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "savePatientPrescriptions", null);
__decorate([
    (0, common_1.Delete)('patient-prescriptions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "deletePatientPrescription", null);
exports.PrescriptionController = PrescriptionController = __decorate([
    (0, swagger_1.ApiTags)('Prescription'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prescription_service_1.PrescriptionService,
        user_location_service_1.UserLocationService])
], PrescriptionController);
//# sourceMappingURL=prescription.controller.js.map