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
exports.TreatmentPlansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const treatment_plan_entity_1 = require("../entities/treatment-plan.entity");
let TreatmentPlansService = class TreatmentPlansService {
    constructor(treatmentPlanRepository) {
        this.treatmentPlanRepository = treatmentPlanRepository;
    }
    async findAll() {
        return this.treatmentPlanRepository.find({
            order: { months: 'ASC' }
        });
    }
    async findOne(id) {
        return this.treatmentPlanRepository.findOne({ where: { id } });
    }
    async create(createTreatmentPlanDto) {
        const treatmentPlan = this.treatmentPlanRepository.create(createTreatmentPlanDto);
        return this.treatmentPlanRepository.save(treatmentPlan);
    }
    async update(id, updateTreatmentPlanDto) {
        await this.treatmentPlanRepository.update(id, updateTreatmentPlanDto);
        return this.treatmentPlanRepository.findOne({ where: { id } });
    }
    async remove(id) {
        await this.treatmentPlanRepository.delete(id);
        return { message: 'Treatment plan deleted successfully' };
    }
};
exports.TreatmentPlansService = TreatmentPlansService;
exports.TreatmentPlansService = TreatmentPlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(treatment_plan_entity_1.TreatmentPlan)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TreatmentPlansService);
//# sourceMappingURL=treatment-plans.service.js.map