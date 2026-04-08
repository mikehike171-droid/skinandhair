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
exports.PatientExaminationController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const patient_examination_service_1 = require("../services/patient-examination.service");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs");
const uploadDir = (0, path_1.join)(process.cwd(), 'patientexaminationreport');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
let PatientExaminationController = class PatientExaminationController {
    constructor(patientExaminationService) {
        this.patientExaminationService = patientExaminationService;
    }
    async create(createExaminationDto, req) {
        const userId = req.user?.userId || req.user?.id;
        return this.patientExaminationService.create(createExaminationDto, userId);
    }
    async getDuePatients(page = '1', limit = '10') {
        return this.patientExaminationService.getDuePatients(parseInt(page), parseInt(limit));
    }
    async getNRList(page = '1', limit = '10', fromDate, toDate) {
        return this.patientExaminationService.getNRList(parseInt(page), parseInt(limit), fromDate, toDate);
    }
    async testNRList() {
        return { message: 'NR List endpoint is working', timestamp: new Date() };
    }
    async debugExamination(id) {
        return this.patientExaminationService.debugExamination(id);
    }
    async getInstallmentReceipt(installmentId) {
        return this.patientExaminationService.getInstallmentReceipt(installmentId);
    }
    async findByPatientId(patientId) {
        return this.patientExaminationService.findByPatientId(patientId);
    }
    async findLatestByPatientId(patientId) {
        return this.patientExaminationService.findLatestByPatientId(patientId);
    }
    async update(id, updateExaminationDto) {
        return this.patientExaminationService.update(id, updateExaminationDto);
    }
    async remove(id) {
        return this.patientExaminationService.remove(id);
    }
    async savePayments(id, paymentData) {
        return this.patientExaminationService.savePayments(id, paymentData);
    }
    async getPayments(id) {
        return this.patientExaminationService.getPayments(id);
    }
    async addPayment(id, paymentData) {
        return this.patientExaminationService.addPayment(id, paymentData);
    }
    async getPaymentInstallments(id) {
        return this.patientExaminationService.getPaymentInstallments(id);
    }
    async getPaymentReceipt(id) {
        return this.patientExaminationService.getPaymentReceipt(id);
    }
    async getDailyReceipt(id) {
        return this.patientExaminationService.getDailyReceipt(id);
    }
    async uploadReports(id, files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded');
        }
        const fileNames = files.map(f => f.filename);
        return this.patientExaminationService.addReportFiles(id, fileNames);
    }
    async getReports(id) {
        return this.patientExaminationService.getReportFiles(id);
    }
    async deleteReport(id, filename) {
        return this.patientExaminationService.deleteReportFile(id, filename, uploadDir);
    }
};
exports.PatientExaminationController = PatientExaminationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('due-patients/all'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "getDuePatients", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('nr-list/all'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('fromDate')),
    __param(3, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "getNRList", null);
__decorate([
    (0, common_1.Get)('nr-list/test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "testNRList", null);
__decorate([
    (0, common_1.Get)('debug/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "debugExamination", null);
__decorate([
    (0, common_1.Get)('installment/:installmentId/receipt'),
    __param(0, (0, common_1.Param)('installmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "getInstallmentReceipt", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "findByPatientId", null);
__decorate([
    (0, common_1.Get)(':patientId/latest'),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "findLatestByPatientId", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/payments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "savePayments", null);
__decorate([
    (0, common_1.Get)(':id/payments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Post)(':id/add-payment'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "addPayment", null);
__decorate([
    (0, common_1.Get)(':id/installments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "getPaymentInstallments", null);
__decorate([
    (0, common_1.Get)(':id/receipt'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "getPaymentReceipt", null);
__decorate([
    (0, common_1.Get)(':id/daily-receipt'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "getDailyReceipt", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/upload-reports'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: uploadDir,
            filename: (req, file, cb) => {
                const patientId = req.params.id;
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `patient_${patientId}_${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowedTypes = /\.(jpg|jpeg|png|gif|pdf|doc|docx)$/i;
            if (!allowedTypes.test((0, path_1.extname)(file.originalname))) {
                return cb(new common_1.BadRequestException('Only image/pdf/doc files are allowed'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "uploadReports", null);
__decorate([
    (0, common_1.Get)(':id/reports'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "getReports", null);
__decorate([
    (0, common_1.Delete)(':id/reports/:filename'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PatientExaminationController.prototype, "deleteReport", null);
exports.PatientExaminationController = PatientExaminationController = __decorate([
    (0, common_1.Controller)('patient-examination'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [patient_examination_service_1.PatientExaminationService])
], PatientExaminationController);
//# sourceMappingURL=patient-examination.controller.js.map