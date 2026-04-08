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
exports.PatientPrescriptionController = void 0;
const common_1 = require("@nestjs/common");
const patient_prescription_service_1 = require("../services/patient-prescription.service");
let PatientPrescriptionController = class PatientPrescriptionController {
    constructor(prescriptionService) {
        this.prescriptionService = prescriptionService;
    }
    createVitals(vitalsData) {
        console.log('Vitals endpoint hit with data:', vitalsData);
        return this.prescriptionService.createVitals(vitalsData);
    }
    getPatientVitals(patientId) {
        return this.prescriptionService.getPatientVitals(patientId);
    }
};
exports.PatientPrescriptionController = PatientPrescriptionController;
__decorate([
    (0, common_1.Post)('vitals'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PatientPrescriptionController.prototype, "createVitals", null);
__decorate([
    (0, common_1.Get)(':patientId/vitals'),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PatientPrescriptionController.prototype, "getPatientVitals", null);
exports.PatientPrescriptionController = PatientPrescriptionController = __decorate([
    (0, common_1.Controller)('api/patient-prescriptions'),
    __metadata("design:paramtypes", [patient_prescription_service_1.PatientPrescriptionService])
], PatientPrescriptionController);
//# sourceMappingURL=patient-prescription.controller.js.map