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
exports.MobileCallTrackingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mobile_number_entity_1 = require("../entities/mobile-number.entity");
const mobile_number_next_call_entity_1 = require("../entities/mobile-number-next-call.entity");
let MobileCallTrackingService = class MobileCallTrackingService {
    constructor(mobileNumberRepository, nextCallRepository) {
        this.mobileNumberRepository = mobileNumberRepository;
        this.nextCallRepository = nextCallRepository;
    }
    async getAssignedNumbers(userId) {
        const query = `
      SELECT 
        m.*,
        nc.disposition,
        nc.caller_by,
        nc.next_call_date as last_next_call_date
      FROM mobile_numbers m
      LEFT JOIN LATERAL (
        SELECT disposition, caller_by, next_call_date
        FROM mobile_number_next_call_ob
        WHERE mobile_number_id = m.id
        ORDER BY id DESC
        LIMIT 1
      ) nc ON true
      WHERE m.user_id = $1 AND m.is_active = true
      ORDER BY m.id ASC
    `;
        return this.mobileNumberRepository.query(query, [userId]);
    }
    async updateCallDetails(mobileId, callData, userId) {
        const nextCallData = this.nextCallRepository.create({
            mobile_number_id: mobileId,
            next_call_date: callData.nextCallDate ? new Date(callData.nextCallDate) : null,
            disposition: callData.disposition,
            patient_feeling: callData.patientFeeling,
            notes: callData.notes,
            caller_by: userId,
            caller_created_at: new Date(),
            caller_updated_at: new Date()
        });
        await this.nextCallRepository.save(nextCallData);
        return {
            success: true,
            message: 'Call details updated successfully'
        };
    }
};
exports.MobileCallTrackingService = MobileCallTrackingService;
exports.MobileCallTrackingService = MobileCallTrackingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mobile_number_entity_1.MobileNumber)),
    __param(1, (0, typeorm_1.InjectRepository)(mobile_number_next_call_entity_1.MobileNumberNextCall)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MobileCallTrackingService);
//# sourceMappingURL=mobile-call-tracking.service.js.map