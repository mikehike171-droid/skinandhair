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
exports.TelecallerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const telecaller_service_1 = require("../services/telecaller.service");
let TelecallerController = class TelecallerController {
    constructor(telecallerService) {
        this.telecallerService = telecallerService;
    }
    async getPatientCallHistory(patientId, req, locationId) {
        const userId = req.user?.user_id || req.user?.id || req.user?.sub;
        const locId = locationId ? parseInt(locationId) : undefined;
        return this.telecallerService.getCallHistory(patientId, locId, userId);
    }
    async addCallRecord(patientId, callData, req, locationId) {
        const userId = req.user?.user_id || req.user?.id || req.user?.sub;
        const locId = locationId ? parseInt(locationId) : (callData.locationId ? parseInt(callData.locationId) : undefined);
        return this.telecallerService.addCallRecord(patientId, callData, userId, locId);
    }
};
exports.TelecallerController = TelecallerController;
__decorate([
    (0, common_1.Get)('patients/:id/call-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient call history' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], TelecallerController.prototype, "getPatientCallHistory", null);
__decorate([
    (0, common_1.Post)('patients/:id/call-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Add call record' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String]),
    __metadata("design:returntype", Promise)
], TelecallerController.prototype, "addCallRecord", null);
exports.TelecallerController = TelecallerController = __decorate([
    (0, swagger_1.ApiTags)('Telecaller'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [telecaller_service_1.TelecallerService])
], TelecallerController);
//# sourceMappingURL=telecaller.controller.js.map