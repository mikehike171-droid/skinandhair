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
exports.PatientAuthController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_entity_1 = require("../entities/patient.entity");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
let PatientAuthController = class PatientAuthController {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }
    async login(loginData) {
        const { email, password } = loginData;
        if (!email || !password) {
            throw new common_1.HttpException('Email and password are required', common_1.HttpStatus.BAD_REQUEST);
        }
        const patient = await this.patientRepository.findOne({
            where: { email: email.toLowerCase() }
        });
        if (!patient) {
            throw new common_1.HttpException('Patient not registered', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (!patient.password) {
            throw new common_1.HttpException('Patient not registered for portal access', common_1.HttpStatus.UNAUTHORIZED);
        }
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        if (patient.password !== hashedPassword) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        }
        const token = jwt.sign({
            id: patient.id,
            patientId: patient.patient_id,
            email: patient.email,
            type: 'patient'
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        return {
            success: true,
            token,
            patient: {
                id: patient.id,
                patientId: patient.patient_id,
                firstName: patient.first_name,
                lastName: patient.last_name,
                name: `${patient.first_name} ${patient.last_name}`,
                email: patient.email,
                mobile: patient.mobile
            }
        };
    }
};
exports.PatientAuthController = PatientAuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientAuthController.prototype, "login", null);
exports.PatientAuthController = PatientAuthController = __decorate([
    (0, common_1.Controller)('patients'),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PatientAuthController);
//# sourceMappingURL=patient-auth.controller.js.map