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
exports.HRPoliciesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const hr_policies_service_1 = require("../services/hr-policies.service");
const hr_policy_dto_1 = require("../dto/hr-policy.dto");
let HRPoliciesController = class HRPoliciesController {
    constructor(hrPoliciesService) {
        this.hrPoliciesService = hrPoliciesService;
    }
    create(createDto) {
        return this.hrPoliciesService.create(createDto);
    }
    findAll(page, limit, search) {
        return this.hrPoliciesService.findAll(page ? +page : 1, limit ? +limit : 10, search);
    }
    findOne(id) {
        return this.hrPoliciesService.findOne(+id);
    }
    update(id, updateDto) {
        return this.hrPoliciesService.update(+id, updateDto);
    }
    remove(id) {
        return this.hrPoliciesService.remove(+id);
    }
};
exports.HRPoliciesController = HRPoliciesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hr_policy_dto_1.CreateHRPolicyDto]),
    __metadata("design:returntype", void 0)
], HRPoliciesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], HRPoliciesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HRPoliciesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hr_policy_dto_1.UpdateHRPolicyDto]),
    __metadata("design:returntype", void 0)
], HRPoliciesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HRPoliciesController.prototype, "remove", null);
exports.HRPoliciesController = HRPoliciesController = __decorate([
    (0, common_1.Controller)('hr-policies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [hr_policies_service_1.HRPoliciesService])
], HRPoliciesController);
//# sourceMappingURL=hr-policies.controller.js.map