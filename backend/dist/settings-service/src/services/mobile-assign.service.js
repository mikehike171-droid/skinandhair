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
exports.MobileAssignService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mobile_number_entity_1 = require("../entities/mobile-number.entity");
let MobileAssignService = class MobileAssignService {
    constructor(mobileNumberRepository) {
        this.mobileNumberRepository = mobileNumberRepository;
    }
    async getUnassignedNumbers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const data = await this.mobileNumberRepository.query('SELECT * FROM mobile_numbers WHERE user_id IS NULL ORDER BY id LIMIT $1 OFFSET $2', [limit, skip]);
        const countResult = await this.mobileNumberRepository.query('SELECT COUNT(*) as total FROM mobile_numbers WHERE user_id IS NULL');
        const total = parseInt(countResult[0].total);
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async getUsers(locationId) {
        const query = `
      SELECT id, username, first_name, last_name 
      FROM users 
      WHERE is_active = true
      ORDER BY first_name, last_name
    `;
        return this.mobileNumberRepository.query(query);
    }
    async assignNumbers(mobileIds, userId, assignedBy) {
        await this.mobileNumberRepository
            .createQueryBuilder()
            .update(mobile_number_entity_1.MobileNumber)
            .set({ user_id: userId, updated_at: new Date() })
            .whereInIds(mobileIds)
            .execute();
        return {
            success: true,
            message: `Successfully assigned ${mobileIds.length} numbers to user`,
            count: mobileIds.length
        };
    }
};
exports.MobileAssignService = MobileAssignService;
exports.MobileAssignService = MobileAssignService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mobile_number_entity_1.MobileNumber)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MobileAssignService);
//# sourceMappingURL=mobile-assign.service.js.map