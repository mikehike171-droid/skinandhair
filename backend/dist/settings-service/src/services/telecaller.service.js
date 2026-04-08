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
exports.TelecallerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const call_history_entity_1 = require("../entities/call-history.entity");
let TelecallerService = class TelecallerService {
    constructor(callHistoryRepository, dataSource) {
        this.callHistoryRepository = callHistoryRepository;
        this.dataSource = dataSource;
    }
    async getCallHistory(patientId, locationId, userId) {
        const whereCondition = { patientId };
        if (locationId) {
            whereCondition.locationId = locationId;
        }
        if (userId) {
            whereCondition.callerBy = userId;
        }
        const callHistory = await this.callHistoryRepository.find({
            where: whereCondition,
            order: { createdAt: 'DESC' }
        });
        const callerIds = [...new Set(callHistory.map(record => record.callerBy).filter(Boolean))];
        const userNames = {};
        if (callerIds.length > 0) {
            try {
                const users = await this.dataSource.query('SELECT id, first_name, last_name FROM users WHERE id = ANY($1)', [callerIds]);
                users.forEach(user => {
                    userNames[user.id] = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                });
            }
            catch (error) {
                console.error('Error fetching user names:', error);
            }
        }
        return callHistory.map((record, index) => ({
            sno: index + 1,
            dateTime: record.createdAt.toISOString(),
            nextCallDate: record.nextCallDate ? new Date(record.nextCallDate).toISOString().split('T')[0] : '',
            disposition: record.disposition || 'Completed',
            callerName: userNames[record.callerBy] || record.callerBy || 'Unknown',
            patientFeeling: record.patientFeeling || '',
            notes: record.notes || ''
        }));
    }
    async addCallRecord(patientId, callData, userId, locationId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
        const callRecord = this.callHistoryRepository.create({
            patientId,
            locationId,
            nextCallDate: callData.nextCallDate ? new Date(callData.nextCallDate) : null,
            callerBy: userId,
            patientFeeling: callData.patientFeeling,
            disposition: callData.disposition,
            notes: callData.notes
        });
        const savedRecord = await this.callHistoryRepository.save(callRecord);
        return {
            success: true,
            message: 'Call record added successfully',
            data: savedRecord
        };
    }
};
exports.TelecallerService = TelecallerService;
exports.TelecallerService = TelecallerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(call_history_entity_1.CallHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], TelecallerService);
//# sourceMappingURL=telecaller.service.js.map