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
exports.MedicalHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const medical_history_service_1 = require("../services/medical-history.service");
let MedicalHistoryController = class MedicalHistoryController {
    constructor(medicalHistoryService) {
        this.medicalHistoryService = medicalHistoryService;
    }
    async getMedicalHistory() {
        return this.medicalHistoryService.getMedicalHistory();
    }
    async createMedicalHistory(data) {
        return this.medicalHistoryService.createMedicalHistory(data);
    }
    async updateMedicalHistory(id, data) {
        return this.medicalHistoryService.updateMedicalHistory(id, data);
    }
    async deleteMedicalHistory(id) {
        return this.medicalHistoryService.deleteMedicalHistory(id);
    }
    async getMedicalHistoryOptions(id) {
        return this.medicalHistoryService.getMedicalHistoryOptions(parseInt(id));
    }
    async createMedicalHistoryOption(data) {
        return this.medicalHistoryService.createMedicalHistoryOption(data);
    }
    async updateMedicalHistoryOption(id, data) {
        return this.medicalHistoryService.updateMedicalHistoryOption(id, data);
    }
    async deleteMedicalHistoryOption(id) {
        return this.medicalHistoryService.deleteMedicalHistoryOption(id);
    }
    async getAllMedicalHistoryOptions() {
        return this.medicalHistoryService.getAllMedicalHistoryOptions();
    }
    async getPersonalHistory() {
        return this.medicalHistoryService.getPersonalHistory();
    }
    async createPersonalHistory(data) {
        return this.medicalHistoryService.createPersonalHistory(data);
    }
    async updatePersonalHistory(id, data) {
        return this.medicalHistoryService.updatePersonalHistory(id, data);
    }
    async deletePersonalHistory(id) {
        return this.medicalHistoryService.deletePersonalHistory(id);
    }
    async getPersonalHistoryOptions(id) {
        return this.medicalHistoryService.getPersonalHistoryOptions(parseInt(id));
    }
    async createPersonalHistoryOption(data) {
        return this.medicalHistoryService.createPersonalHistoryOption(data);
    }
    async updatePersonalHistoryOption(id, data) {
        return this.medicalHistoryService.updatePersonalHistoryOption(id, data);
    }
    async deletePersonalHistoryOption(id) {
        return this.medicalHistoryService.deletePersonalHistoryOption(id);
    }
    async getAllPersonalHistoryOptions() {
        return this.medicalHistoryService.getAllPersonalHistoryOptions();
    }
    async getLifestyle() {
        return this.medicalHistoryService.getLifestyle();
    }
    async createLifestyle(data) {
        return this.medicalHistoryService.createLifestyle(data);
    }
    async updateLifestyle(id, data) {
        return this.medicalHistoryService.updateLifestyle(id, data);
    }
    async deleteLifestyle(id) {
        return this.medicalHistoryService.deleteLifestyle(id);
    }
    async getLifestyleOptions(id) {
        return this.medicalHistoryService.getLifestyleOptions(parseInt(id));
    }
    async createLifestyleOption(data) {
        return this.medicalHistoryService.createLifestyleOption(data);
    }
    async updateLifestyleOption(id, data) {
        return this.medicalHistoryService.updateLifestyleOption(id, data);
    }
    async deleteLifestyleOption(id) {
        return this.medicalHistoryService.deleteLifestyleOption(id);
    }
    async getAllLifestyleOptions() {
        return this.medicalHistoryService.getAllLifestyleOptions();
    }
    async getFamilyHistory() {
        return this.medicalHistoryService.getFamilyHistory();
    }
    async createFamilyHistory(data) {
        return this.medicalHistoryService.createFamilyHistory(data);
    }
    async updateFamilyHistory(id, data) {
        return this.medicalHistoryService.updateFamilyHistory(id, data);
    }
    async deleteFamilyHistory(id) {
        return this.medicalHistoryService.deleteFamilyHistory(id);
    }
    async getFamilyHistoryOptions(id) {
        return this.medicalHistoryService.getFamilyHistoryOptions(parseInt(id));
    }
    async createFamilyHistoryOption(data) {
        return this.medicalHistoryService.createFamilyHistoryOption(data);
    }
    async updateFamilyHistoryOption(id, data) {
        return this.medicalHistoryService.updateFamilyHistoryOption(id, data);
    }
    async deleteFamilyHistoryOption(id) {
        return this.medicalHistoryService.deleteFamilyHistoryOption(id);
    }
    async getAllFamilyHistoryOptions() {
        return this.medicalHistoryService.getAllFamilyHistoryOptions();
    }
    async getDrugHistory() {
        return this.medicalHistoryService.getDrugHistory();
    }
    async createDrugHistory(data) {
        return this.medicalHistoryService.createDrugHistory(data);
    }
    async updateDrugHistory(id, data) {
        return this.medicalHistoryService.updateDrugHistory(id, data);
    }
    async deleteDrugHistory(id) {
        return this.medicalHistoryService.deleteDrugHistory(id);
    }
    async getDrugHistoryOptions(id) {
        return this.medicalHistoryService.getDrugHistoryOptions(parseInt(id));
    }
    async createDrugHistoryOption(data) {
        return this.medicalHistoryService.createDrugHistoryOption(data);
    }
    async updateDrugHistoryOption(id, data) {
        return this.medicalHistoryService.updateDrugHistoryOption(id, data);
    }
    async deleteDrugHistoryOption(id) {
        return this.medicalHistoryService.deleteDrugHistoryOption(id);
    }
    async getAllDrugHistoryOptions() {
        return this.medicalHistoryService.getAllDrugHistoryOptions();
    }
    async getAllergies() {
        return this.medicalHistoryService.getAllergies();
    }
    async createAllergy(data) {
        return this.medicalHistoryService.createAllergy(data);
    }
    async updateAllergy(id, data) {
        return this.medicalHistoryService.updateAllergy(id, data);
    }
    async deleteAllergy(id) {
        return this.medicalHistoryService.deleteAllergy(id);
    }
    async getAllergiesOptions(id) {
        return this.medicalHistoryService.getAllergiesOptions(parseInt(id));
    }
    async createAllergyOption(data) {
        return this.medicalHistoryService.createAllergyOption(data);
    }
    async updateAllergyOption(id, data) {
        return this.medicalHistoryService.updateAllergyOption(id, data);
    }
    async deleteAllergyOption(id) {
        return this.medicalHistoryService.deleteAllergyOption(id);
    }
    async getAllAllergiesOptions() {
        return this.medicalHistoryService.getAllAllergiesOptions();
    }
    async getSocialHistory() {
        return this.medicalHistoryService.getSocialHistory();
    }
    async createSocialHistory(data) {
        return this.medicalHistoryService.createSocialHistory(data);
    }
    async updateSocialHistory(id, data) {
        return this.medicalHistoryService.updateSocialHistory(id, data);
    }
    async deleteSocialHistory(id) {
        return this.medicalHistoryService.deleteSocialHistory(id);
    }
    async getSocialHistoryOptions(id) {
        return this.medicalHistoryService.getSocialHistoryOptions(parseInt(id));
    }
    async createSocialHistoryOption(data) {
        return this.medicalHistoryService.createSocialHistoryOption(data);
    }
    async updateSocialHistoryOption(id, data) {
        return this.medicalHistoryService.updateSocialHistoryOption(id, data);
    }
    async deleteSocialHistoryOption(id) {
        return this.medicalHistoryService.deleteSocialHistoryOption(id);
    }
    async getAllSocialHistoryOptions() {
        return this.medicalHistoryService.getAllSocialHistoryOptions();
    }
    async getMedicationType() {
        return this.medicalHistoryService.getMedicationType();
    }
    async createMedicationType(data) {
        return this.medicalHistoryService.createMedicationType(data);
    }
    async updateMedicationType(id, data) {
        return this.medicalHistoryService.updateMedicationType(id, data);
    }
    async deleteMedicationType(id) {
        return this.medicalHistoryService.deleteMedicationType(id);
    }
    async getMedicine() {
        return this.medicalHistoryService.getMedicine();
    }
    async createMedicine(data) {
        return this.medicalHistoryService.createMedicine(data);
    }
    async updateMedicine(id, data) {
        return this.medicalHistoryService.updateMedicine(id, data);
    }
    async deleteMedicine(id) {
        return this.medicalHistoryService.deleteMedicine(id);
    }
    async getPotency() {
        return this.medicalHistoryService.getPotency();
    }
    async createPotency(data) {
        return this.medicalHistoryService.createPotency(data);
    }
    async updatePotency(id, data) {
        return this.medicalHistoryService.updatePotency(id, data);
    }
    async deletePotency(id) {
        return this.medicalHistoryService.deletePotency(id);
    }
    async getDosage() {
        return this.medicalHistoryService.getDosage();
    }
    async createDosage(data) {
        return this.medicalHistoryService.createDosage(data);
    }
    async updateDosage(id, data) {
        return this.medicalHistoryService.updateDosage(id, data);
    }
    async deleteDosage(id) {
        return this.medicalHistoryService.deleteDosage(id);
    }
    async getPharmacyPrescriptions() {
        return this.medicalHistoryService.getPharmacyPrescriptions();
    }
    async updatePrescriptionStatus(id, data) {
        return this.medicalHistoryService.updatePrescriptionStatus(id, data.status);
    }
    async getPatientExaminations(page = '1', limit = '10', fromDate, toDate, search) {
        return this.medicalHistoryService.getPatientExaminations(undefined, parseInt(page), parseInt(limit), fromDate, toDate, search);
    }
    async getPatientMedicalHistory(patientId, req) {
        return this.medicalHistoryService.getPatientMedicalHistory(patientId, req.user);
    }
    async savePatientMedicalHistory(data, req) {
        return this.medicalHistoryService.savePatientMedicalHistory(data, req.user);
    }
    async deletePatientMedicalHistory(data, req) {
        return this.medicalHistoryService.deletePatientMedicalHistory(data, req.user);
    }
};
exports.MedicalHistoryController = MedicalHistoryController;
__decorate([
    (0, common_1.Get)('medical-history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getMedicalHistory", null);
__decorate([
    (0, common_1.Post)('medical-history'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createMedicalHistory", null);
__decorate([
    (0, common_1.Put)('medical-history/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateMedicalHistory", null);
__decorate([
    (0, common_1.Delete)('medical-history/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteMedicalHistory", null);
__decorate([
    (0, common_1.Get)('medical-history-options/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getMedicalHistoryOptions", null);
__decorate([
    (0, common_1.Post)('medical-history-options'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createMedicalHistoryOption", null);
__decorate([
    (0, common_1.Put)('medical-history-options/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateMedicalHistoryOption", null);
__decorate([
    (0, common_1.Delete)('medical-history-options/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteMedicalHistoryOption", null);
__decorate([
    (0, common_1.Get)('medical-history-options'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getAllMedicalHistoryOptions", null);
__decorate([
    (0, common_1.Get)('personal-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all personal history' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getPersonalHistory", null);
__decorate([
    (0, common_1.Post)('personal-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Create personal history' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createPersonalHistory", null);
__decorate([
    (0, common_1.Put)('personal-history/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update personal history' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updatePersonalHistory", null);
__decorate([
    (0, common_1.Delete)('personal-history/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete personal history' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deletePersonalHistory", null);
__decorate([
    (0, common_1.Get)('personal-history-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get personal history options by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getPersonalHistoryOptions", null);
__decorate([
    (0, common_1.Post)('personal-history-options'),
    (0, swagger_1.ApiOperation)({ summary: 'Create personal history option' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createPersonalHistoryOption", null);
__decorate([
    (0, common_1.Put)('personal-history-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update personal history option' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updatePersonalHistoryOption", null);
__decorate([
    (0, common_1.Delete)('personal-history-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete personal history option' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deletePersonalHistoryOption", null);
__decorate([
    (0, common_1.Get)('personal-history-options'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all personal history options' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getAllPersonalHistoryOptions", null);
__decorate([
    (0, common_1.Get)('lifestyle'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all lifestyle' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getLifestyle", null);
__decorate([
    (0, common_1.Post)('lifestyle'),
    (0, swagger_1.ApiOperation)({ summary: 'Create lifestyle' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createLifestyle", null);
__decorate([
    (0, common_1.Put)('lifestyle/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lifestyle' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateLifestyle", null);
__decorate([
    (0, common_1.Delete)('lifestyle/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete lifestyle' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteLifestyle", null);
__decorate([
    (0, common_1.Get)('lifestyle-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lifestyle options by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getLifestyleOptions", null);
__decorate([
    (0, common_1.Post)('lifestyle-options'),
    (0, swagger_1.ApiOperation)({ summary: 'Create lifestyle option' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createLifestyleOption", null);
__decorate([
    (0, common_1.Put)('lifestyle-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lifestyle option' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateLifestyleOption", null);
__decorate([
    (0, common_1.Delete)('lifestyle-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete lifestyle option' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteLifestyleOption", null);
__decorate([
    (0, common_1.Get)('lifestyle-options'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all lifestyle options' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getAllLifestyleOptions", null);
__decorate([
    (0, common_1.Get)('family-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all family history' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getFamilyHistory", null);
__decorate([
    (0, common_1.Post)('family-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Create family history' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createFamilyHistory", null);
__decorate([
    (0, common_1.Put)('family-history/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update family history' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateFamilyHistory", null);
__decorate([
    (0, common_1.Delete)('family-history/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete family history' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteFamilyHistory", null);
__decorate([
    (0, common_1.Get)('family-history-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get family history options by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getFamilyHistoryOptions", null);
__decorate([
    (0, common_1.Post)('family-history-options'),
    (0, swagger_1.ApiOperation)({ summary: 'Create family history option' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createFamilyHistoryOption", null);
__decorate([
    (0, common_1.Put)('family-history-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update family history option' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateFamilyHistoryOption", null);
__decorate([
    (0, common_1.Delete)('family-history-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete family history option' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteFamilyHistoryOption", null);
__decorate([
    (0, common_1.Get)('family-history-options'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all family history options' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getAllFamilyHistoryOptions", null);
__decorate([
    (0, common_1.Get)('drug-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all drug history' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getDrugHistory", null);
__decorate([
    (0, common_1.Post)('drug-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Create drug history' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createDrugHistory", null);
__decorate([
    (0, common_1.Put)('drug-history/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update drug history' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateDrugHistory", null);
__decorate([
    (0, common_1.Delete)('drug-history/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete drug history' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteDrugHistory", null);
__decorate([
    (0, common_1.Get)('drug-history-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get drug history options by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getDrugHistoryOptions", null);
__decorate([
    (0, common_1.Post)('drug-history-options'),
    (0, swagger_1.ApiOperation)({ summary: 'Create drug history option' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createDrugHistoryOption", null);
__decorate([
    (0, common_1.Put)('drug-history-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update drug history option' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateDrugHistoryOption", null);
__decorate([
    (0, common_1.Delete)('drug-history-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete drug history option' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteDrugHistoryOption", null);
__decorate([
    (0, common_1.Get)('drug-history-options'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all drug history options' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getAllDrugHistoryOptions", null);
__decorate([
    (0, common_1.Get)('allergies'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all allergies' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getAllergies", null);
__decorate([
    (0, common_1.Post)('allergies'),
    (0, swagger_1.ApiOperation)({ summary: 'Create allergy' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createAllergy", null);
__decorate([
    (0, common_1.Put)('allergies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update allergy' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateAllergy", null);
__decorate([
    (0, common_1.Delete)('allergies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete allergy' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteAllergy", null);
__decorate([
    (0, common_1.Get)('allergies-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get allergy options by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getAllergiesOptions", null);
__decorate([
    (0, common_1.Post)('allergies-options'),
    (0, swagger_1.ApiOperation)({ summary: 'Create allergy option' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createAllergyOption", null);
__decorate([
    (0, common_1.Put)('allergies-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update allergy option' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateAllergyOption", null);
__decorate([
    (0, common_1.Delete)('allergies-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete allergy option' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteAllergyOption", null);
__decorate([
    (0, common_1.Get)('allergies-options'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all allergy options' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getAllAllergiesOptions", null);
__decorate([
    (0, common_1.Get)('social-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all social history' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getSocialHistory", null);
__decorate([
    (0, common_1.Post)('social-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Create social history' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createSocialHistory", null);
__decorate([
    (0, common_1.Put)('social-history/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update social history' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateSocialHistory", null);
__decorate([
    (0, common_1.Delete)('social-history/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete social history' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteSocialHistory", null);
__decorate([
    (0, common_1.Get)('social-history-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get social history options by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getSocialHistoryOptions", null);
__decorate([
    (0, common_1.Post)('social-history-options'),
    (0, swagger_1.ApiOperation)({ summary: 'Create social history option' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createSocialHistoryOption", null);
__decorate([
    (0, common_1.Put)('social-history-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update social history option' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateSocialHistoryOption", null);
__decorate([
    (0, common_1.Delete)('social-history-options/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete social history option' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteSocialHistoryOption", null);
__decorate([
    (0, common_1.Get)('social-history-options'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all social history options' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getAllSocialHistoryOptions", null);
__decorate([
    (0, common_1.Get)('medication-type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all medication types' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getMedicationType", null);
__decorate([
    (0, common_1.Post)('medication-type'),
    (0, swagger_1.ApiOperation)({ summary: 'Create medication type' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createMedicationType", null);
__decorate([
    (0, common_1.Put)('medication-type/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update medication type' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateMedicationType", null);
__decorate([
    (0, common_1.Delete)('medication-type/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete medication type' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteMedicationType", null);
__decorate([
    (0, common_1.Get)('medicine'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all medicine' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getMedicine", null);
__decorate([
    (0, common_1.Post)('medicine'),
    (0, swagger_1.ApiOperation)({ summary: 'Create medicine' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createMedicine", null);
__decorate([
    (0, common_1.Put)('medicine/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update medicine' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateMedicine", null);
__decorate([
    (0, common_1.Delete)('medicine/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete medicine' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteMedicine", null);
__decorate([
    (0, common_1.Get)('potency'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all potency' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getPotency", null);
__decorate([
    (0, common_1.Post)('potency'),
    (0, swagger_1.ApiOperation)({ summary: 'Create potency' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createPotency", null);
__decorate([
    (0, common_1.Put)('potency/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update potency' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updatePotency", null);
__decorate([
    (0, common_1.Delete)('potency/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete potency' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deletePotency", null);
__decorate([
    (0, common_1.Get)('dosage'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all dosage' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getDosage", null);
__decorate([
    (0, common_1.Post)('dosage'),
    (0, swagger_1.ApiOperation)({ summary: 'Create dosage' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "createDosage", null);
__decorate([
    (0, common_1.Put)('dosage/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update dosage' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updateDosage", null);
__decorate([
    (0, common_1.Delete)('dosage/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete dosage' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deleteDosage", null);
__decorate([
    (0, common_1.Get)('pharmacy/prescriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pharmacy prescriptions with patient and medicine details' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getPharmacyPrescriptions", null);
__decorate([
    (0, common_1.Put)('pharmacy/prescriptions/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update prescription status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "updatePrescriptionStatus", null);
__decorate([
    (0, common_1.Get)('patient-examinations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient examinations with patient details' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('from_date')),
    __param(3, (0, common_1.Query)('to_date')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getPatientExaminations", null);
__decorate([
    (0, common_1.Get)('patient-medical-history/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "getPatientMedicalHistory", null);
__decorate([
    (0, common_1.Post)('patient-medical-history'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "savePatientMedicalHistory", null);
__decorate([
    (0, common_1.Delete)('patient-medical-history'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MedicalHistoryController.prototype, "deletePatientMedicalHistory", null);
exports.MedicalHistoryController = MedicalHistoryController = __decorate([
    (0, swagger_1.ApiTags)('Medical History'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [medical_history_service_1.MedicalHistoryService])
], MedicalHistoryController);
//# sourceMappingURL=medical-history.controller.js.map