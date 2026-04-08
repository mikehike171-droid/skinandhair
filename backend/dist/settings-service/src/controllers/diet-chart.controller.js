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
exports.DietChartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const diet_chart_service_1 = require("../services/diet-chart.service");
let DietChartController = class DietChartController {
    constructor(dietChartService) {
        this.dietChartService = dietChartService;
    }
    async getPatientDietCharts(patientId, req) {
        return this.dietChartService.getPatientDietCharts(patientId, req.user);
    }
    async savePatientDietCharts(data, req) {
        return this.dietChartService.savePatientDietCharts(data, req.user);
    }
    async deletePatientDietChart(id, req) {
        return this.dietChartService.deletePatientDietChart(parseInt(id), req.user);
    }
};
exports.DietChartController = DietChartController;
__decorate([
    (0, common_1.Get)('patient-diet-charts/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DietChartController.prototype, "getPatientDietCharts", null);
__decorate([
    (0, common_1.Post)('patient-diet-charts'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DietChartController.prototype, "savePatientDietCharts", null);
__decorate([
    (0, common_1.Delete)('patient-diet-charts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DietChartController.prototype, "deletePatientDietChart", null);
exports.DietChartController = DietChartController = __decorate([
    (0, swagger_1.ApiTags)('Diet Chart'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [diet_chart_service_1.DietChartService])
], DietChartController);
//# sourceMappingURL=diet-chart.controller.js.map