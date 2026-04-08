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
exports.MobileAssignController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const mobile_assign_service_1 = require("../services/mobile-assign.service");
let MobileAssignController = class MobileAssignController {
    constructor(mobileAssignService) {
        this.mobileAssignService = mobileAssignService;
    }
    async getUnassignedNumbers(req) {
        const page = parseInt(req.query?.page) || 1;
        const limit = parseInt(req.query?.limit) || 10;
        return this.mobileAssignService.getUnassignedNumbers(page, limit);
    }
    async getUsers(req) {
        const locationId = req.user?.location_id || 1;
        return this.mobileAssignService.getUsers(locationId);
    }
    async assignNumbers(data, req) {
        const assignedBy = req.user?.user_id || req.user?.id;
        return this.mobileAssignService.assignNumbers(data.mobileIds, data.userId, assignedBy);
    }
};
exports.MobileAssignController = MobileAssignController;
__decorate([
    (0, common_1.Get)('unassigned'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unassigned mobile numbers' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MobileAssignController.prototype, "getUnassignedNumbers", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get users for assignment' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MobileAssignController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign mobile numbers to user' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MobileAssignController.prototype, "assignNumbers", null);
exports.MobileAssignController = MobileAssignController = __decorate([
    (0, swagger_1.ApiTags)('Mobile Assign'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('mobile-assign'),
    __metadata("design:paramtypes", [mobile_assign_service_1.MobileAssignService])
], MobileAssignController);
//# sourceMappingURL=mobile-assign.controller.js.map