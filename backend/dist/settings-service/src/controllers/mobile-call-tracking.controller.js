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
exports.MobileCallTrackingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const mobile_call_tracking_service_1 = require("../services/mobile-call-tracking.service");
let MobileCallTrackingController = class MobileCallTrackingController {
    constructor(mobileCallTrackingService) {
        this.mobileCallTrackingService = mobileCallTrackingService;
    }
    async getMyNumbers(req) {
        const userId = req.user?.user_id || req.user?.id || req.user?.sub;
        console.log('Getting numbers for user:', userId);
        return this.mobileCallTrackingService.getAssignedNumbers(userId);
    }
    async test() {
        return { message: 'API working', timestamp: new Date() };
    }
    async updateCall(id, callData, req) {
        const userId = req.user?.user_id || req.user?.id || 1;
        return this.mobileCallTrackingService.updateCallDetails(parseInt(id), callData, userId);
    }
};
exports.MobileCallTrackingController = MobileCallTrackingController;
__decorate([
    (0, common_1.Get)('my-numbers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get assigned mobile numbers for current user' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MobileCallTrackingController.prototype, "getMyNumbers", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MobileCallTrackingController.prototype, "test", null);
__decorate([
    (0, common_1.Post)('update-call/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update call details for mobile number' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MobileCallTrackingController.prototype, "updateCall", null);
exports.MobileCallTrackingController = MobileCallTrackingController = __decorate([
    (0, swagger_1.ApiTags)('Mobile Call Tracking'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('mobile-call-tracking'),
    __metadata("design:paramtypes", [mobile_call_tracking_service_1.MobileCallTrackingService])
], MobileCallTrackingController);
//# sourceMappingURL=mobile-call-tracking.controller.js.map