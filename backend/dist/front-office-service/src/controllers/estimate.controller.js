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
exports.EstimateController = void 0;
const common_1 = require("@nestjs/common");
const estimate_service_1 = require("../services/estimate.service");
const create_estimate_dto_1 = require("../dto/create-estimate.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let EstimateController = class EstimateController {
    constructor(estimateService) {
        this.estimateService = estimateService;
    }
    create(createEstimateDto) {
        return this.estimateService.create(createEstimateDto);
    }
    findAll(locationId) {
        return this.estimateService.findAll(locationId);
    }
    findOne(id) {
        return this.estimateService.findOne(id);
    }
    updateStatus(id, status) {
        return this.estimateService.updateStatus(id, status);
    }
    convertToBill(id, userId) {
        return this.estimateService.convertToBill(id, userId);
    }
};
exports.EstimateController = EstimateController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_estimate_dto_1.CreateEstimateDto]),
    __metadata("design:returntype", void 0)
], EstimateController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EstimateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EstimateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], EstimateController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/convert-to-bill'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], EstimateController.prototype, "convertToBill", null);
exports.EstimateController = EstimateController = __decorate([
    (0, common_1.Controller)('api/estimates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [estimate_service_1.EstimateService])
], EstimateController);
//# sourceMappingURL=estimate.controller.js.map