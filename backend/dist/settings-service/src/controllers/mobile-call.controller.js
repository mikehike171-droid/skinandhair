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
exports.MobileCallController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let callRequests = [];
let requestIdCounter = 1;
let MobileCallController = class MobileCallController {
    triggerMobileCall(body) {
        const { phone_number, patient_name, patient_id, requested_by, user_id } = body;
        const callRequest = {
            id: requestIdCounter++,
            phone_number,
            patient_name: patient_name || 'Unknown Patient',
            patient_id,
            requested_by: requested_by || 'System',
            user_id: user_id || null,
            created_at: new Date().toISOString(),
        };
        callRequests.push(callRequest);
        console.log('New call request created:', callRequest);
        return { success: true, message: 'Mobile call request created', data: callRequest };
    }
    getMobileCallRequests(req) {
        const userId = req.user?.user_id || req.user?.id || req.user?.sub;
        console.log('Getting call requests for user:', userId);
        console.log('User object:', req.user);
        if (!userId) {
            console.log('No user ID found, returning all requests');
            return callRequests;
        }
        const filteredRequests = callRequests.filter(request => request.user_id === userId);
        console.log('Filtered call requests:', filteredRequests);
        return filteredRequests;
    }
    deleteCallRequest(id) {
        const requestId = parseInt(id);
        const initialLength = callRequests.length;
        callRequests = callRequests.filter(request => request.id !== requestId);
        const deleted = callRequests.length < initialLength;
        console.log(`Delete request ${requestId}: ${deleted ? 'success' : 'not found'}`);
        return { success: deleted };
    }
};
exports.MobileCallController = MobileCallController;
__decorate([
    (0, common_1.Post)('trigger-mobile-call'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobileCallController.prototype, "triggerMobileCall", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('mobile-call-requests'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobileCallController.prototype, "getMobileCallRequests", null);
__decorate([
    (0, common_1.Delete)('mobile-call-requests/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MobileCallController.prototype, "deleteCallRequest", null);
exports.MobileCallController = MobileCallController = __decorate([
    (0, common_1.Controller)()
], MobileCallController);
//# sourceMappingURL=mobile-call.controller.js.map