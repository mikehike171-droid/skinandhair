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
exports.PatientRegistrationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const patient_registration_service_1 = require("../services/patient-registration.service");
const patient_list_service_1 = require("../services/patient-list.service");
const user_location_service_1 = require("../services/user-location.service");
let PatientRegistrationController = class PatientRegistrationController {
    constructor(patientRegistrationService, patientListService, userLocationService) {
        this.patientRegistrationService = patientRegistrationService;
        this.patientListService = patientListService;
        this.userLocationService = userLocationService;
    }
    async getAllPatients(req, queryLocationId, patientSourceId, fromDate, toDate, search, page, limit) {
        const userId = req.user.sub || req.user.id || req.user.userId;
        let locationId;
        if (queryLocationId && queryLocationId !== 'all' && queryLocationId !== '0') {
            locationId = parseInt(queryLocationId);
        }
        else {
            locationId = await this.userLocationService.getUserLocationId(userId);
        }
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        if (patientSourceId) {
            return this.patientListService.getPatientsBySource(locationId, parseInt(patientSourceId), fromDate, toDate);
        }
        return this.patientListService.getAllPatients(locationId, fromDate, toDate, pageNum, limitNum, search);
    }
    async searchPatients(req, searchQuery, queryLocationId, page, limit) {
        const userId = req.user.sub || req.user.id || req.user.userId;
        let locationId;
        if (queryLocationId && queryLocationId !== 'all' && queryLocationId !== '0') {
            locationId = parseInt(queryLocationId);
        }
        else {
            locationId = await this.userLocationService.getUserLocationId(userId);
        }
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        return this.patientListService.getAllPatients(locationId, undefined, undefined, pageNum, limitNum, searchQuery);
    }
    async getRefPatients(req, queryLocationId, page, limit) {
        const userId = req.user.sub || req.user.id || req.user.userId;
        const locationId = queryLocationId ? parseInt(queryLocationId) : await this.userLocationService.getUserLocationId(userId);
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        return this.patientListService.getRefPatients(locationId, pageNum, limitNum);
    }
    async getEmployeeRefPatients(req, queryLocationId, page, limit) {
        const userId = req.user.sub || req.user.id || req.user.userId;
        const locationId = queryLocationId ? parseInt(queryLocationId) : await this.userLocationService.getUserLocationId(userId);
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        return this.patientListService.getEmployeeRefPatients(locationId, pageNum, limitNum);
    }
    async getPatientById(patientId, req, queryLocationId) {
        const userId = req.user?.sub || req.user?.id || req.user?.userId;
        const locationId = queryLocationId ? parseInt(queryLocationId) : await this.userLocationService.getUserLocationId(userId);
        return this.patientListService.getPatientById(patientId, locationId, userId);
    }
    async registerPatient(req, patientData) {
        const userId = req.user.sub || req.user.id || req.user.userId;
        if (!userId) {
            throw new Error('User ID is required');
        }
        const locationId = await this.userLocationService.getUserLocationId(userId);
        return this.patientRegistrationService.registerPatient(patientData, locationId, userId);
    }
    async updatePatient(patientId, req, patientData) {
        const userId = req.user.sub || req.user.id || req.user.userId;
        if (!userId) {
            throw new Error('User ID is required');
        }
        const locationId = await this.userLocationService.getUserLocationId(userId);
        return this.patientRegistrationService.updatePatient(patientId, patientData, locationId, userId);
    }
};
exports.PatientRegistrationController = PatientRegistrationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all patients' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('locationId')),
    __param(2, (0, common_1.Query)('patient_source_id')),
    __param(3, (0, common_1.Query)('fromDate')),
    __param(4, (0, common_1.Query)('toDate')),
    __param(5, (0, common_1.Query)('search')),
    __param(6, (0, common_1.Query)('page')),
    __param(7, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PatientRegistrationController.prototype, "getAllPatients", null);
__decorate([
    (0, common_1.Post)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search patients' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('query')),
    __param(2, (0, common_1.Query)('locationId')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PatientRegistrationController.prototype, "searchPatients", null);
__decorate([
    (0, common_1.Get)('ref-patients/list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all ref patients' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('locationId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], PatientRegistrationController.prototype, "getRefPatients", null);
__decorate([
    (0, common_1.Get)('employee-ref/list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all employee ref patients' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('locationId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], PatientRegistrationController.prototype, "getEmployeeRefPatients", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PatientRegistrationController.prototype, "getPatientById", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register new patient' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientRegistrationController.prototype, "registerPatient", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update patient' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PatientRegistrationController.prototype, "updatePatient", null);
exports.PatientRegistrationController = PatientRegistrationController = __decorate([
    (0, swagger_1.ApiTags)('Patient Registration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('patients'),
    __metadata("design:paramtypes", [patient_registration_service_1.PatientRegistrationService,
        patient_list_service_1.PatientListService,
        user_location_service_1.UserLocationService])
], PatientRegistrationController);
//# sourceMappingURL=patient-registration.controller.js.map