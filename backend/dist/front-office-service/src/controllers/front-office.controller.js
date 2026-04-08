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
exports.FrontOfficeController = void 0;
const common_1 = require("@nestjs/common");
const microservice_client_service_1 = require("../services/microservice-client.service");
let FrontOfficeController = class FrontOfficeController {
    constructor(microserviceClient) {
        this.microserviceClient = microserviceClient;
    }
    async getDashboard(locationId) {
        try {
            const [appointments, queueStats] = await Promise.all([
                this.microserviceClient.get('appointment', `/api/appointments?locationId=${locationId}&date=${new Date().toISOString().split('T')[0]}`),
                this.microserviceClient.get('front-office', `/api/queue/stats?locationId=${locationId}`),
            ]);
            return {
                appointments: appointments || [],
                queueStats: queueStats || {},
                todayDate: new Date().toISOString().split('T')[0],
            };
        }
        catch (error) {
            return {
                appointments: [],
                queueStats: {},
                todayDate: new Date().toISOString().split('T')[0],
                error: 'Some services are unavailable',
            };
        }
    }
    async searchPatients(query, locationId) {
        return this.microserviceClient.get('patient', `/api/patients/search?query=${query}&locationId=${locationId}`);
    }
    async getServices(locationId) {
        return [
            { id: "S001", name: "General Consultation", price: 500, category: "Consultation" },
            { id: "S002", name: "Cardiology Consultation", price: 800, category: "Consultation" },
            { id: "S003", name: "Blood Test - Complete", price: 300, category: "Laboratory" },
            { id: "S004", name: "X-Ray Chest", price: 400, category: "Radiology" },
            { id: "S005", name: "ECG", price: 200, category: "Investigation" },
        ];
    }
    async getPackages(locationId) {
        return this.microserviceClient.getPackages(locationId);
    }
    async createQuickAppointment(appointmentData) {
        return this.microserviceClient.createAppointment(appointmentData);
    }
    async getPatientHistory(patientId) {
        try {
            const patient = { id: patientId, name: 'Patient Data' };
            const [appointments, bills] = await Promise.all([
                this.microserviceClient.getAppointments(patientId),
                this.microserviceClient.get('billing', `/api/bills?patientId=${patientId}`),
            ]);
            return {
                patient,
                appointments: appointments || [],
                bills: bills || [],
            };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.FrontOfficeController = FrontOfficeController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FrontOfficeController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('patient-search'),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], FrontOfficeController.prototype, "searchPatients", null);
__decorate([
    (0, common_1.Get)('services'),
    __param(0, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FrontOfficeController.prototype, "getServices", null);
__decorate([
    (0, common_1.Get)('packages'),
    __param(0, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FrontOfficeController.prototype, "getPackages", null);
__decorate([
    (0, common_1.Post)('quick-appointment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FrontOfficeController.prototype, "createQuickAppointment", null);
__decorate([
    (0, common_1.Get)('patient/:id/history'),
    __param(0, (0, common_1.Query)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FrontOfficeController.prototype, "getPatientHistory", null);
exports.FrontOfficeController = FrontOfficeController = __decorate([
    (0, common_1.Controller)('api/front-office'),
    __metadata("design:paramtypes", [microservice_client_service_1.MicroserviceClientService])
], FrontOfficeController);
//# sourceMappingURL=front-office.controller.js.map