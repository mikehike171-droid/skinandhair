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
exports.PharmacyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pharmacy_entity_1 = require("./entities/pharmacy.entity");
let PharmacyService = class PharmacyService {
    constructor(medicineRepository, prescriptionRepository, prescriptionItemRepository) {
        this.medicineRepository = medicineRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionItemRepository = prescriptionItemRepository;
    }
    async getPrescriptions(locationId) {
        const query = `
      SELECT 
        p.id as prescription_id,
        p.prescription_number,
        p.created_at,
        p.notes,
        pt.first_name || ' ' || pt.last_name as patient_name,
        pt.mobile,
        u.first_name || ' ' || u.last_name as doctor_name,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'medicine_type', pi.medicine_type,
              'medicine', pi.medicine_name,
              'potency', pi.potency,
              'dosage', pi.dosage,
              'morning', pi.morning,
              'afternoon', pi.afternoon,
              'night', pi.night
            )
          ) FILTER (WHERE pi.id IS NOT NULL), 
          '[]'::json
        ) as medicines,
        7 as medicine_days,
        NULL as next_appointment_date,
        p.notes as notes_to_pharmacy
      FROM prescriptions p
      LEFT JOIN patients pt ON p.patient_id = pt.id
      LEFT JOIN users u ON p.doctor_id = u.id
      LEFT JOIN prescription_items pi ON p.id = pi.prescription_id
      WHERE p.location_id = $1 AND p.status = 'pending'
      GROUP BY p.id, p.prescription_number, p.created_at, p.notes, pt.first_name, pt.last_name, pt.mobile, u.first_name, u.last_name
      ORDER BY p.created_at DESC
    `;
        const result = await this.prescriptionRepository.query(query, [locationId]);
        return result;
    }
    async updatePrescriptionStatus(prescriptionId, status) {
        const statusMap = {
            1: 'dispensed',
            2: 'cancelled'
        };
        await this.prescriptionRepository.update(prescriptionId, {
            status: statusMap[status]
        });
        return { message: 'Status updated successfully' };
    }
    async getMedicines(locationId) {
        return this.medicineRepository.find({
            where: { locationId, isActive: true },
            order: { name: 'ASC' }
        });
    }
};
exports.PharmacyService = PharmacyService;
exports.PharmacyService = PharmacyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pharmacy_entity_1.Medicine)),
    __param(1, (0, typeorm_1.InjectRepository)(pharmacy_entity_1.Prescription)),
    __param(2, (0, typeorm_1.InjectRepository)(pharmacy_entity_1.PrescriptionItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PharmacyService);
//# sourceMappingURL=pharmacy.service.js.map