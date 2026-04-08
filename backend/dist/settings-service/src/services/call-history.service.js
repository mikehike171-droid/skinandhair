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
exports.CallHistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mobile_number_entity_1 = require("../entities/mobile-number.entity");
let CallHistoryService = class CallHistoryService {
    constructor(mobileNumberRepository) {
        this.mobileNumberRepository = mobileNumberRepository;
    }
    async getAllCallHistory(page = 1, limit = 10, locationId, fromDate, toDate) {
        const skip = (page - 1) * limit;
        let query = `SELECT m.*, u.first_name, u.last_name, u.username
                 FROM mobile_numbers m
                 LEFT JOIN users u ON m.caller_by = u.id
                 WHERE m.caller_created_at IS NOT NULL`;
        let countQuery = `SELECT COUNT(*) as total FROM mobile_numbers m WHERE m.caller_created_at IS NOT NULL`;
        let params = [];
        let countParams = [];
        if (locationId) {
            query += ` AND m.location_id = $${params.length + 1}`;
            countQuery += ` AND m.location_id = $${countParams.length + 1}`;
            params.push(locationId);
            countParams.push(locationId);
        }
        if (fromDate) {
            query += ` AND DATE(m.caller_created_at) >= $${params.length + 1}`;
            countQuery += ` AND DATE(m.caller_created_at) >= $${countParams.length + 1}`;
            params.push(fromDate);
            countParams.push(fromDate);
        }
        if (toDate) {
            query += ` AND DATE(m.caller_created_at) <= $${params.length + 1}`;
            countQuery += ` AND DATE(m.caller_created_at) <= $${countParams.length + 1}`;
            params.push(toDate);
            countParams.push(toDate);
        }
        query += ` ORDER BY m.caller_created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, skip);
        const data = await this.mobileNumberRepository.query(query, params);
        const countResult = await this.mobileNumberRepository.query(countQuery, countParams);
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
    async getCallHistoryByUser(userId, page = 1, limit = 10, locationId, fromDate, toDate) {
        const skip = (page - 1) * limit;
        let query = `SELECT m.*, u.first_name, u.last_name, u.username
                 FROM mobile_numbers m
                 LEFT JOIN users u ON m.caller_by = u.id
                 WHERE m.caller_by = $1 AND m.caller_created_at IS NOT NULL`;
        let countQuery = `SELECT COUNT(*) as total FROM mobile_numbers WHERE caller_by = $1 AND caller_created_at IS NOT NULL`;
        let params = [userId];
        let countParams = [userId];
        if (locationId) {
            query += ` AND m.location_id = $${params.length + 1}`;
            countQuery += ` AND location_id = $${countParams.length + 1}`;
            params.push(locationId);
            countParams.push(locationId);
        }
        if (fromDate) {
            query += ` AND DATE(m.caller_created_at) >= $${params.length + 1}`;
            countQuery += ` AND DATE(caller_created_at) >= $${countParams.length + 1}`;
            params.push(fromDate);
            countParams.push(fromDate);
        }
        if (toDate) {
            query += ` AND DATE(m.caller_created_at) <= $${params.length + 1}`;
            countQuery += ` AND DATE(caller_created_at) <= $${countParams.length + 1}`;
            params.push(toDate);
            countParams.push(toDate);
        }
        query += ` ORDER BY m.caller_created_at DESC, m.updated_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, skip);
        const data = await this.mobileNumberRepository.query(query, params);
        const countResult = await this.mobileNumberRepository.query(countQuery, countParams);
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
};
exports.CallHistoryService = CallHistoryService;
exports.CallHistoryService = CallHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mobile_number_entity_1.MobileNumber)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CallHistoryService);
//# sourceMappingURL=call-history.service.js.map