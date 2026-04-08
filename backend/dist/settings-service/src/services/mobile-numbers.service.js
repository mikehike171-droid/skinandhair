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
exports.MobileNumbersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mobile_number_entity_1 = require("../entities/mobile-number.entity");
let MobileNumbersService = class MobileNumbersService {
    constructor(mobileNumberRepository) {
        this.mobileNumberRepository = mobileNumberRepository;
    }
    async getMobileNumbersByUserId(userId, page = 1, limit = 10, locationId, fromDate, toDate) {
        const skip = (page - 1) * limit;
        let query = `SELECT m.* FROM mobile_numbers m WHERE m.user_id = $1`;
        let countQuery = `SELECT COUNT(*) as total FROM mobile_numbers WHERE user_id = $1`;
        let params = [userId];
        let countParams = [userId];
        if (locationId) {
            query += ` AND m.location_id = $${params.length + 1}`;
            countQuery += ` AND location_id = $${countParams.length + 1}`;
            params.push(locationId);
            countParams.push(locationId);
        }
        if (!fromDate && !toDate) {
            const today = new Date().toISOString().split('T')[0];
            query += ` AND (m.next_call_date IS NULL OR DATE(m.updated_at) = '${today}')`;
            countQuery += ` AND (next_call_date IS NULL OR DATE(updated_at) = '${today}')`;
        }
        else {
            if (fromDate) {
                query += ` AND DATE(m.updated_at) >= $${params.length + 1}`;
                countQuery += ` AND DATE(updated_at) >= $${countParams.length + 1}`;
                params.push(fromDate);
                countParams.push(fromDate);
            }
            if (toDate) {
                query += ` AND DATE(m.updated_at) <= $${params.length + 1}`;
                countQuery += ` AND DATE(updated_at) <= $${countParams.length + 1}`;
                params.push(toDate);
                countParams.push(toDate);
            }
        }
        query += ` ORDER BY m.updated_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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
    async getMyNextCallDateNumbers(userId, page = 1, limit = 10, locationId, fromDate, toDate) {
        const skip = (page - 1) * limit;
        let query = `
      SELECT 
        nc.id,
        m.mobile,
        nc.next_call_date,
        nc.disposition,
        nc.patient_feeling,
        nc.notes,
        nc.caller_by,
        nc.caller_created_at,
        nc.caller_updated_at
      FROM mobile_number_next_call_ob nc
      INNER JOIN mobile_numbers m ON m.id = nc.mobile_number_id
      WHERE m.user_id = $1
    `;
        let countQuery = `
      SELECT COUNT(*) as total 
      FROM mobile_number_next_call_ob nc
      INNER JOIN mobile_numbers m ON m.id = nc.mobile_number_id
      WHERE m.user_id = $1
    `;
        let params = [userId];
        let countParams = [userId];
        let paramIndex = 2;
        let countParamIndex = 2;
        if (locationId) {
            query += ` AND m.location_id = $${paramIndex}`;
            countQuery += ` AND m.location_id = $${countParamIndex}`;
            params.push(locationId);
            countParams.push(locationId);
            paramIndex++;
            countParamIndex++;
        }
        if (fromDate) {
            query += ` AND DATE(nc.next_call_date) >= $${paramIndex}`;
            countQuery += ` AND DATE(nc.next_call_date) >= $${countParamIndex}`;
            params.push(fromDate);
            countParams.push(fromDate);
            paramIndex++;
            countParamIndex++;
        }
        if (toDate) {
            query += ` AND DATE(nc.next_call_date) <= $${paramIndex}`;
            countQuery += ` AND DATE(nc.next_call_date) <= $${countParamIndex}`;
            params.push(toDate);
            countParams.push(toDate);
            paramIndex++;
            countParamIndex++;
        }
        query += ` ORDER BY nc.next_call_date ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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
    async getNextCallDateNumbers(userId, page = 1, limit = 10, locationId, fromDate, toDate) {
        const skip = (page - 1) * limit;
        let query = `SELECT m.* FROM mobile_numbers m WHERE m.next_call_date IS NOT NULL`;
        let countQuery = `SELECT COUNT(*) as total FROM mobile_numbers WHERE next_call_date IS NOT NULL`;
        let params = [];
        let countParams = [];
        if (locationId) {
            query += ` AND m.location_id = $${params.length + 1}`;
            countQuery += ` AND location_id = $${countParams.length + 1}`;
            params.push(locationId);
            countParams.push(locationId);
        }
        if (fromDate) {
            query += ` AND DATE(m.next_call_date) >= $${params.length + 1}`;
            countQuery += ` AND DATE(next_call_date) >= $${countParams.length + 1}`;
            params.push(fromDate);
            countParams.push(fromDate);
        }
        if (toDate) {
            query += ` AND DATE(m.next_call_date) <= $${params.length + 1}`;
            countQuery += ` AND DATE(next_call_date) <= $${countParams.length + 1}`;
            params.push(toDate);
            countParams.push(toDate);
        }
        query += ` ORDER BY m.next_call_date ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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
    async getTodayCallsByUserId(userId, page = 1, limit = 10, locationId) {
        const skip = (page - 1) * limit;
        const today = new Date().toISOString().split('T')[0];
        let query = `SELECT m.* FROM mobile_numbers m WHERE m.user_id = $1 AND m.caller_created_at IS NOT NULL AND DATE(m.caller_created_at) = '${today}'`;
        let countQuery = `SELECT COUNT(*) as total FROM mobile_numbers WHERE user_id = $1 AND caller_created_at IS NOT NULL AND DATE(caller_created_at) = '${today}'`;
        let params = [userId];
        let countParams = [userId];
        if (locationId) {
            query += ` AND m.location_id = $${params.length + 1}`;
            countQuery += ` AND location_id = $${countParams.length + 1}`;
            params.push(locationId);
            countParams.push(locationId);
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
    async getAllMobileNumbers(userId) {
        return this.mobileNumberRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' }
        });
    }
    async getAllUnassignedNumbers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await this.mobileNumberRepository
            .createQueryBuilder('mobile_numbers')
            .where('mobile_numbers.user_id IS NULL')
            .orderBy('mobile_numbers.created_at', 'DESC')
            .take(limit)
            .skip(skip)
            .getManyAndCount();
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
    async addMobileNumber(mobile, userId, locationId) {
        const mobileNumber = this.mobileNumberRepository.create({
            mobile,
            user_id: null,
            location_id: locationId,
            created_by: userId
        });
        return this.mobileNumberRepository.save(mobileNumber);
    }
    async bulkUpload(file, userId, locationId) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        try {
            const fileContent = file.buffer.toString('utf8');
            const lines = fileContent.split('\n');
            const mobileNumbers = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    const mobile = line.split(',')[0].trim();
                    if (mobile && mobile.length >= 10) {
                        mobileNumbers.push({
                            mobile: mobile,
                            user_id: null,
                            location_id: locationId,
                            created_by: userId
                        });
                    }
                }
            }
            if (mobileNumbers.length === 0) {
                throw new Error('No valid mobile numbers found in file');
            }
            const savedNumbers = await this.mobileNumberRepository.save(mobileNumbers);
            return {
                success: true,
                message: `Successfully uploaded ${savedNumbers.length} mobile numbers`,
                count: savedNumbers.length
            };
        }
        catch (error) {
            throw new Error(`Failed to process file: ${error.message}`);
        }
    }
    async getMyOBCallHistory(userId, page = 1, limit = 10, locationId, fromDate, toDate) {
        const skip = (page - 1) * limit;
        let query = `
      SELECT 
        nc.id,
        m.mobile,
        nc.disposition,
        nc.notes,
        nc.caller_created_at as created_at,
        nc.caller_by,
        u.first_name || ' ' || u.last_name as caller_name,
        p.first_name || ' ' || p.last_name as patient_name
      FROM mobile_number_next_call_ob nc
      INNER JOIN mobile_numbers m ON m.id = nc.mobile_number_id
      LEFT JOIN users u ON u.id = nc.caller_by
      LEFT JOIN patients p ON p.mobile = m.mobile
      WHERE nc.caller_by = $1
    `;
        let countQuery = `
      SELECT COUNT(*) as total 
      FROM mobile_number_next_call_ob 
      WHERE caller_by = $1
    `;
        let params = [userId];
        let countParams = [userId];
        let paramIndex = 2;
        let countParamIndex = 2;
        if (locationId) {
            query += ` AND m.location_id = $${paramIndex}`;
            countQuery += ` AND EXISTS (SELECT 1 FROM mobile_numbers WHERE id = mobile_number_id AND location_id = $${countParamIndex})`;
            params.push(locationId);
            countParams.push(locationId);
            paramIndex++;
            countParamIndex++;
        }
        if (fromDate) {
            query += ` AND DATE(nc.caller_created_at) >= $${paramIndex}`;
            countQuery += ` AND DATE(caller_created_at) >= $${countParamIndex}`;
            params.push(fromDate);
            countParams.push(fromDate);
            paramIndex++;
            countParamIndex++;
        }
        if (toDate) {
            query += ` AND DATE(nc.caller_created_at) <= $${paramIndex}`;
            countQuery += ` AND DATE(caller_created_at) <= $${countParamIndex}`;
            params.push(toDate);
            countParams.push(toDate);
            paramIndex++;
            countParamIndex++;
        }
        query += ` ORDER BY nc.caller_created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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
exports.MobileNumbersService = MobileNumbersService;
exports.MobileNumbersService = MobileNumbersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mobile_number_entity_1.MobileNumber)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MobileNumbersService);
//# sourceMappingURL=mobile-numbers.service.js.map