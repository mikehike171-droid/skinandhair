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
exports.TodayCollectionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_installment_entity_1 = require("../entities/payment-installment.entity");
let TodayCollectionsService = class TodayCollectionsService {
    constructor(paymentInstallmentRepository) {
        this.paymentInstallmentRepository = paymentInstallmentRepository;
    }
    async getTodayCollections(locationId, fromDate, toDate) {
        let startOfDay;
        let endOfDay;
        if (fromDate && toDate) {
            startOfDay = new Date(fromDate);
            endOfDay = new Date(toDate);
            endOfDay.setHours(23, 59, 59, 999);
        }
        else {
            const today = new Date();
            startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        }
        const query = this.paymentInstallmentRepository
            .createQueryBuilder('pi')
            .leftJoin('patient_examination', 'pe', 'pe.id = pi.patientExaminationId')
            .select([
            'pe.createdAt as examinationDate',
            'pe.totalAmount as totalAmount',
            'pi.id as installmentId',
            'pi.amount as installmentAmount',
            'pi.paymentDate as paymentDate',
            'pi.paymentMethod as paymentMethod'
        ])
            .where('pi.paymentDate >= :startOfDay', { startOfDay })
            .andWhere('pi.paymentDate <= :endOfDay', { endOfDay });
        if (locationId) {
            query.andWhere('pe.locationId = :locationId', { locationId });
        }
        query.orderBy('pi.paymentDate', 'DESC');
        return query.getRawMany();
    }
};
exports.TodayCollectionsService = TodayCollectionsService;
exports.TodayCollectionsService = TodayCollectionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_installment_entity_1.PaymentInstallment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TodayCollectionsService);
//# sourceMappingURL=today-collections.service.js.map