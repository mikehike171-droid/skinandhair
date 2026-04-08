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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreatmentPlanMonthController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const treatment_plan_month_service_1 = require("../services/treatment-plan-month.service");
let TreatmentPlanMonthController = class TreatmentPlanMonthController {
    constructor(treatmentPlanMonthService) {
        this.treatmentPlanMonthService = treatmentPlanMonthService;
    }
    async findAll() {
        return this.treatmentPlanMonthService.findAll();
    }
};
exports.TreatmentPlanMonthController = TreatmentPlanMonthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TreatmentPlanMonthController.prototype, "findAll", null);
exports.TreatmentPlanMonthController = TreatmentPlanMonthController = __decorate([
    (0, common_1.Controller)('treatment-plan-month'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [treatment_plan_month_service_1.TreatmentPlanMonthService])
], TreatmentPlanMonthController);
//# sourceMappingURL=treatment-plan-month.controller.js.map