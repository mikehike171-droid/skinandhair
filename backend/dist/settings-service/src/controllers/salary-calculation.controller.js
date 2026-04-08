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
exports.SalaryCalculationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const salary_calculation_service_1 = require("../services/salary-calculation.service");
let SalaryCalculationController = class SalaryCalculationController {
    constructor(salaryService) {
        this.salaryService = salaryService;
    }
    calculateMonthlySalary(locationId, month, year) {
        const currentDate = new Date();
        const monthNum = month ? parseInt(month) : currentDate.getMonth() + 1;
        const yearNum = year ? parseInt(year) : currentDate.getFullYear();
        return this.salaryService.calculateMonthlySalary(+locationId, monthNum, yearNum);
    }
    calculateUserSalary(userId, locationId, month, year) {
        const currentDate = new Date();
        const monthNum = month ? parseInt(month) : currentDate.getMonth() + 1;
        const yearNum = year ? parseInt(year) : currentDate.getFullYear();
        return this.salaryService.calculateUserSalary(+userId, +locationId, monthNum, yearNum);
    }
};
exports.SalaryCalculationController = SalaryCalculationController;
__decorate([
    (0, common_1.Get)('monthly'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate monthly salary for all users' }),
    __param(0, (0, common_1.Query)('locationId')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], SalaryCalculationController.prototype, "calculateMonthlySalary", null);
__decorate([
    (0, common_1.Get)('user'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate salary for specific user' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('locationId')),
    __param(2, (0, common_1.Query)('month')),
    __param(3, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], SalaryCalculationController.prototype, "calculateUserSalary", null);
exports.SalaryCalculationController = SalaryCalculationController = __decorate([
    (0, swagger_1.ApiTags)('Settings - Salary Calculation'),
    (0, common_1.Controller)('settings/salary-calculation'),
    __metadata("design:paramtypes", [salary_calculation_service_1.SalaryCalculationService])
], SalaryCalculationController);
//# sourceMappingURL=salary-calculation.controller.js.map