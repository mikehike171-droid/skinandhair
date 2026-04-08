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
exports.MobileNumbersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const mobile_numbers_service_1 = require("../services/mobile-numbers.service");
let MobileNumbersController = class MobileNumbersController {
    constructor(mobileNumbersService) {
        this.mobileNumbersService = mobileNumbersService;
    }
    async healthCheck() {
        return { status: 'ok', message: 'Mobile Numbers Controller DEPLOYED AND WORKING', timestamp: new Date().toISOString(), version: '3.0' };
    }
    async getMyNextCallDateNumbers(req, page = 1, limit = 10, locationId, fromDate, toDate) {
        console.log('my-next-call-date endpoint called');
        const userId = req.user?.user_id || req.user?.id || req.user?.sub;
        return this.mobileNumbersService.getMyNextCallDateNumbers(userId, page, limit, locationId, fromDate, toDate);
    }
    async getNextCallDateNumbers(req, page = 1, limit = 10, locationId, fromDate, toDate) {
        const userId = req.user?.user_id || req.user?.id || req.user?.sub;
        return this.mobileNumbersService.getNextCallDateNumbers(userId, page, limit, locationId, fromDate, toDate);
    }
    async getMyOBCallHistory(req, page = 1, limit = 10, locationId, fromDate, toDate) {
        const userId = req.user?.user_id || req.user?.id || req.user?.sub;
        return this.mobileNumbersService.getMyOBCallHistory(userId, page, limit, locationId, fromDate, toDate);
    }
    async getTodayCalls(req, page = 1, limit = 10, locationId) {
        const userId = req.user?.user_id || req.user?.id || req.user?.sub;
        return this.mobileNumbersService.getTodayCallsByUserId(userId, page, limit, locationId);
    }
    async getMyMobileNumbers(req, page = 1, limit = 10, locationId, fromDate, toDate) {
        const userId = req.user?.user_id || req.user?.id || req.user?.sub;
        console.log('Getting mobile numbers for logged-in user:', userId);
        return this.mobileNumbersService.getMobileNumbersByUserId(userId, page, limit, locationId, fromDate, toDate);
    }
    async getMobileNumbersByUser(userId, page = 1, limit = 10, locationId, fromDate, toDate) {
        console.log('Getting mobile numbers for user:', userId);
        return this.mobileNumbersService.getMobileNumbersByUserId(userId, page, limit, locationId, fromDate, toDate);
    }
    async getAllMobileNumbers(req, page = 1, limit = 10) {
        return this.mobileNumbersService.getAllUnassignedNumbers(page, limit);
    }
    async bulkUpload(file, req) {
        const userId = req.user?.user_id || req.user?.id;
        const locationId = req.user?.location_id || 1;
        return this.mobileNumbersService.bulkUpload(file, userId, locationId);
    }
    async addMobileNumber(data, req) {
        const userId = req.user?.user_id || req.user?.id;
        const locationId = req.user?.location_id || 1;
        return this.mobileNumbersService.addMobileNumber(data.mobile, userId, locationId);
    }
};
exports.MobileNumbersController = MobileNumbersController;
__decorate([
    (0, common_1.Get)('health-check'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check for mobile numbers controller' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MobileNumbersController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-next-call-date'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my mobile numbers by next call date' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('locationId')),
    __param(4, (0, common_1.Query)('fromDate')),
    __param(5, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], MobileNumbersController.prototype, "getMyNextCallDateNumbers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('next-call-date'),
    (0, swagger_1.ApiOperation)({ summary: 'Get mobile numbers by next call date' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('locationId')),
    __param(4, (0, common_1.Query)('fromDate')),
    __param(5, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], MobileNumbersController.prototype, "getNextCallDateNumbers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-ob-call-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get logged-in user OB call history' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('locationId')),
    __param(4, (0, common_1.Query)('fromDate')),
    __param(5, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], MobileNumbersController.prototype, "getMyOBCallHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('today-calls'),
    (0, swagger_1.ApiOperation)({ summary: 'Get today calls for logged-in user' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('location_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], MobileNumbersController.prototype, "getTodayCalls", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-numbers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get mobile numbers for logged-in user' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('location_id')),
    __param(4, (0, common_1.Query)('from_date')),
    __param(5, (0, common_1.Query)('to_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], MobileNumbersController.prototype, "getMyMobileNumbers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get mobile numbers for specific user (mobile app)' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('location_id')),
    __param(4, (0, common_1.Query)('from_date')),
    __param(5, (0, common_1.Query)('to_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], MobileNumbersController.prototype, "getMobileNumbersByUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all mobile numbers' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], MobileNumbersController.prototype, "getAllMobileNumbers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('bulk-upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk upload mobile numbers from Excel' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MobileNumbersController.prototype, "bulkUpload", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add single mobile number' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MobileNumbersController.prototype, "addMobileNumber", null);
exports.MobileNumbersController = MobileNumbersController = __decorate([
    (0, swagger_1.ApiTags)('Mobile Numbers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('mobile-numbers'),
    __metadata("design:paramtypes", [mobile_numbers_service_1.MobileNumbersService])
], MobileNumbersController);
//# sourceMappingURL=mobile-numbers.controller.js.map