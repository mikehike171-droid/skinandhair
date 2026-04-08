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
exports.MicroserviceClientService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let MicroserviceClientService = class MicroserviceClientService {
    constructor(configService) {
        this.configService = configService;
    }
    getServiceUrl(serviceName) {
        const urls = {
            user: this.configService.get('USER_SERVICE_URL'),
            billing: this.configService.get('BILLING_SERVICE_URL'),
            appointment: this.configService.get('APPOINTMENT_SERVICE_URL'),
            clinical: this.configService.get('CLINICAL_SERVICE_URL'),
            laboratory: this.configService.get('LABORATORY_SERVICE_URL'),
            pharmacy: this.configService.get('PHARMACY_SERVICE_URL'),
        };
        return urls[serviceName];
    }
    async get(serviceName, endpoint, headers) {
        try {
            const baseUrl = this.getServiceUrl(serviceName);
            const response = await fetch(`${baseUrl}${endpoint}`, {
                headers: { 'Content-Type': 'application/json', ...headers }
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        }
        catch (error) {
            throw new common_1.HttpException(`Error communicating with ${serviceName} service: ${error.message}`, common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    async post(serviceName, endpoint, data, headers) {
        try {
            const baseUrl = this.getServiceUrl(serviceName);
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...headers },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        }
        catch (error) {
            throw new common_1.HttpException(`Error communicating with ${serviceName} service: ${error.message}`, common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    async put(serviceName, endpoint, data, headers) {
        try {
            const baseUrl = this.getServiceUrl(serviceName);
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...headers },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        }
        catch (error) {
            throw new common_1.HttpException(`Error communicating with ${serviceName} service: ${error.message}`, common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    async delete(serviceName, endpoint, headers) {
        try {
            const baseUrl = this.getServiceUrl(serviceName);
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', ...headers }
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        }
        catch (error) {
            throw new common_1.HttpException(`Error communicating with ${serviceName} service: ${error.message}`, common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
    async createBill(billData, headers) {
        return this.post('billing', '/api/bills', billData, headers);
    }
    async getAppointments(patientId, headers) {
        return this.get('appointment', `/api/appointments?patientId=${patientId}`, headers);
    }
    async createAppointment(appointmentData, headers) {
        return this.post('appointment', '/api/appointments', appointmentData, headers);
    }
    async getServices(locationId, headers) {
        return this.get('billing', `/api/services?locationId=${locationId}`, headers);
    }
    async getPackages(locationId, headers) {
        return this.get('billing', `/api/packages?locationId=${locationId}`, headers);
    }
};
exports.MicroserviceClientService = MicroserviceClientService;
exports.MicroserviceClientService = MicroserviceClientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MicroserviceClientService);
//# sourceMappingURL=microservice-client.service.js.map