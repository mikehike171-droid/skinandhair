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
exports.PresentingComplaintsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const presenting_complaints_service_1 = require("../services/presenting-complaints.service");
let PresentingComplaintsController = class PresentingComplaintsController {
    constructor(presentingComplaintsService) {
        this.presentingComplaintsService = presentingComplaintsService;
    }
    async savePatientPresentingComplaints(data, req) {
        return this.presentingComplaintsService.savePatientPresentingComplaints(data, req.user);
    }
    async getPatientPresentingComplaints(patientId) {
        return this.presentingComplaintsService.getPatientPresentingComplaints(patientId);
    }
    async deletePatientPresentingComplaint(id, req) {
        return this.presentingComplaintsService.deletePatientPresentingComplaint(parseInt(id), req.user);
    }
};
exports.PresentingComplaintsController = PresentingComplaintsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Save patient presenting complaints' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PresentingComplaintsController.prototype, "savePatientPresentingComplaints", null);
__decorate([
    (0, common_1.Get)(':patientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient presenting complaints history' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PresentingComplaintsController.prototype, "getPatientPresentingComplaints", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a patient presenting complaint' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PresentingComplaintsController.prototype, "deletePatientPresentingComplaint", null);
exports.PresentingComplaintsController = PresentingComplaintsController = __decorate([
    (0, swagger_1.ApiTags)('Presenting Complaints'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('patient-presenting-complaints'),
    __metadata("design:paramtypes", [presenting_complaints_service_1.PresentingComplaintsService])
], PresentingComplaintsController);
//# sourceMappingURL=presenting-complaints.controller.js.map