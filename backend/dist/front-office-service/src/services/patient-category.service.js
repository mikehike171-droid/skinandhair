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
exports.PatientCategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_category_entity_1 = require("../entities/patient-category.entity");
let PatientCategoryService = class PatientCategoryService {
    constructor(patientCategoryRepository) {
        this.patientCategoryRepository = patientCategoryRepository;
    }
    async findAll() {
        return this.patientCategoryRepository.find({ where: { is_active: true } });
    }
};
exports.PatientCategoryService = PatientCategoryService;
exports.PatientCategoryService = PatientCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_category_entity_1.PatientCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PatientCategoryService);
//# sourceMappingURL=patient-category.service.js.map