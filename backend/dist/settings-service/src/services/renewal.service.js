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
exports.RenewalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_examination_entity_1 = require("../entities/patient-examination.entity");
let RenewalService = class RenewalService {
    constructor(patientExaminationRepository) {
        this.patientExaminationRepository = patientExaminationRepository;
    }
    async getRenewalPatients(locationId, fromDate, toDate) {
        let query = `
      SELECT 
        pe.patient_id as "patientId",
        p.first_name as "firstName",
        p.last_name as "lastName",
        p.mobile as "mobileNumber",
        pe.next_renewal_date_pro as "nextRenewalDatePro",
        pe.treatment_plan_months_pro as "treatmentPlanMonthsPro"
      FROM patient_examination pe
      LEFT JOIN patients p ON pe.patient_id::integer = p.id
      WHERE pe.next_renewal_date_pro IS NOT NULL
        AND p.location_id = $1`;
        const params = [locationId];
        if (fromDate) {
            query += ` AND DATE(pe.next_renewal_date_pro) >= $${params.length + 1}`;
            params.push(fromDate);
        }
        if (toDate) {
            query += ` AND DATE(pe.next_renewal_date_pro) <= $${params.length + 1}`;
            params.push(toDate);
        }
        query += ` ORDER BY pe.next_renewal_date_pro ASC`;
        return this.patientExaminationRepository.query(query, params);
    }
};
exports.RenewalService = RenewalService;
exports.RenewalService = RenewalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_examination_entity_1.PatientExamination)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RenewalService);
//# sourceMappingURL=renewal.service.js.map