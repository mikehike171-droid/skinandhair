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
exports.MastersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let MastersController = class MastersController {
    getGenders() {
        return [
            { id: 1, name: 'Male', code: 'M' },
            { id: 2, name: 'Female', code: 'F' },
            { id: 3, name: 'Other', code: 'O' },
        ];
    }
    getBloodGroups() {
        return [
            { id: 1, name: 'A+', code: 'A+' },
            { id: 2, name: 'A-', code: 'A-' },
            { id: 3, name: 'B+', code: 'B+' },
            { id: 4, name: 'B-', code: 'B-' },
            { id: 5, name: 'O+', code: 'O+' },
            { id: 6, name: 'O-', code: 'O-' },
            { id: 7, name: 'AB+', code: 'AB+' },
            { id: 8, name: 'AB-', code: 'AB-' },
        ];
    }
    getMaritalStatuses() {
        return [
            { id: 1, name: 'Single', code: 'S' },
            { id: 2, name: 'Married', code: 'M' },
            { id: 3, name: 'Divorced', code: 'D' },
            { id: 4, name: 'Widowed', code: 'W' },
        ];
    }
    getPatientSources() {
        return [
            { id: 1, name: 'Walk-in', code: 'WALK' },
            { id: 2, name: 'Referral', code: 'REFR' },
            { id: 3, name: 'Social Media', code: 'SOCM' },
            { id: 4, name: 'Website', code: 'WEBS' },
            { id: 5, name: 'Direct', code: 'DIRC' },
        ];
    }
    getConsultationTypes() {
        return [
            { id: 1, name: 'General Consultation', code: 'GEN' },
            { id: 2, name: 'Follow-up', code: 'FOL' },
            { id: 3, name: 'Emergency', code: 'EMR' },
            { id: 4, name: 'Specialist', code: 'SPC' },
        ];
    }
};
exports.MastersController = MastersController;
__decorate([
    (0, common_1.Get)('gender'),
    (0, swagger_1.ApiOperation)({ summary: 'Get gender list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "getGenders", null);
__decorate([
    (0, common_1.Get)('blood-group'),
    (0, swagger_1.ApiOperation)({ summary: 'Get blood group list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "getBloodGroups", null);
__decorate([
    (0, common_1.Get)('marital-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get marital status list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "getMaritalStatuses", null);
__decorate([
    (0, common_1.Get)('patient-source'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient source list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "getPatientSources", null);
__decorate([
    (0, common_1.Get)('consultation-types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get consultation types list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MastersController.prototype, "getConsultationTypes", null);
exports.MastersController = MastersController = __decorate([
    (0, swagger_1.ApiTags)('Settings - Masters'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('masters')
], MastersController);
//# sourceMappingURL=masters.controller.js.map