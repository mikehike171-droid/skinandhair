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
exports.CallHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const call_history_service_1 = require("../services/call-history.service");
let CallHistoryController = class CallHistoryController {
    constructor(callHistoryService) {
        this.callHistoryService = callHistoryService;
    }
    async getAllCallHistory(page = '1', limit = '10', locationId, fromDate, toDate, req) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const locId = locationId ? parseInt(locationId) : null;
        console.log('Call history params:', { page: pageNum, limit: limitNum, locationId: locId, fromDate, toDate });
        return this.callHistoryService.getAllCallHistory(pageNum, limitNum, locId, fromDate, toDate);
    }
    async getMyCallHistory(page = '1', limit = '10', locationId, fromDate, toDate, userId, req) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const locId = locationId ? parseInt(locationId) : null;
        const userIdNum = userId ? parseInt(userId) : req.user?.sub;
        let defaultFromDate = fromDate;
        let defaultToDate = toDate;
        if (!fromDate || !toDate) {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            defaultFromDate = firstDay.toISOString().split('T')[0];
            defaultToDate = lastDay.toISOString().split('T')[0];
        }
        return this.callHistoryService.getCallHistoryByUser(userIdNum, pageNum, limitNum, locId, defaultFromDate, defaultToDate);
    }
    async getCallHistoryByUser(userId, page = '1', limit = '10', locationId, fromDate, toDate) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const locId = locationId ? parseInt(locationId) : null;
        return this.callHistoryService.getCallHistoryByUser(parseInt(userId), pageNum, limitNum, locId, fromDate, toDate);
    }
};
exports.CallHistoryController = CallHistoryController;
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all call history' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('locationId')),
    __param(3, (0, common_1.Query)('fromDate')),
    __param(4, (0, common_1.Query)('toDate')),
    __param(5, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], CallHistoryController.prototype, "getAllCallHistory", null);
__decorate([
    (0, common_1.Get)('user'),
    (0, swagger_1.ApiOperation)({ summary: 'Get call history for current user' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('locationId')),
    __param(3, (0, common_1.Query)('fromDate')),
    __param(4, (0, common_1.Query)('toDate')),
    __param(5, (0, common_1.Query)('userId')),
    __param(6, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], CallHistoryController.prototype, "getMyCallHistory", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get call history for specific user' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('locationId')),
    __param(4, (0, common_1.Query)('fromDate')),
    __param(5, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CallHistoryController.prototype, "getCallHistoryByUser", null);
exports.CallHistoryController = CallHistoryController = __decorate([
    (0, swagger_1.ApiTags)('Call History'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('call-history'),
    __metadata("design:paramtypes", [call_history_service_1.CallHistoryService])
], CallHistoryController);
//# sourceMappingURL=call-history.controller.js.map