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
exports.CashCollectionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_installment_entity_1 = require("../entities/payment-installment.entity");
let CashCollectionsService = class CashCollectionsService {
    constructor(paymentInstallmentRepository) {
        this.paymentInstallmentRepository = paymentInstallmentRepository;
    }
    async getCashCollections(locationId, page = 1, limit = 10, fromDate, toDate) {
        const query = this.paymentInstallmentRepository
            .createQueryBuilder('pi')
            .leftJoin('patient_examination', 'pe', 'pe.id = pi.patientExaminationId')
            .select([
            'pi.id as id',
            'DATE(pi.paymentDate) as date',
            'pi.amount as amount',
            'pi.paymentMethod as payment_method',
            '\'credit\' as transaction_type'
        ])
            .where('LOWER(pi.paymentMethod) = :paymentMethod', { paymentMethod: 'cash' });
        if (locationId) {
            query.andWhere('pe.locationId = :locationId', { locationId });
        }
        if (fromDate) {
            query.andWhere('pi.paymentDate >= :fromDate', { fromDate });
        }
        if (toDate) {
            query.andWhere('pi.paymentDate <= :toDate', { toDate });
        }
        let expensesQuery = `
      SELECT 
        ee.id,
        DATE(ee.updated_at) as date,
        ee.amount,
        'Expense' as payment_method,
        'debit' as transaction_type
      FROM employee_expenses ee
      WHERE ee.status = 'approved'
    `;
        const expenseParams = [];
        let paramIndex = 1;
        if (locationId) {
            expensesQuery += ` AND ee.location_id = $${paramIndex}`;
            expenseParams.push(locationId);
            paramIndex++;
        }
        if (fromDate) {
            expensesQuery += ` AND ee.updated_at >= $${paramIndex}`;
            expenseParams.push(fromDate);
            paramIndex++;
        }
        if (toDate) {
            expensesQuery += ` AND ee.updated_at <= $${paramIndex}`;
            expenseParams.push(toDate);
            paramIndex++;
        }
        const [collections, expenses] = await Promise.all([
            query.getRawMany(),
            this.paymentInstallmentRepository.query(expensesQuery, expenseParams)
        ]);
        const groupedByDate = {};
        collections.forEach(item => {
            const dateKey = item.date;
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = { date: dateKey, credit: 0, debit: 0 };
            }
            groupedByDate[dateKey].credit += parseFloat(item.amount);
        });
        expenses.forEach(item => {
            const dateKey = item.date;
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = { date: dateKey, credit: 0, debit: 0 };
            }
            groupedByDate[dateKey].debit += parseFloat(item.amount);
        });
        const combined = Object.values(groupedByDate).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        let balance = 0;
        const sortedAsc = [...combined].reverse();
        const dataWithBalance = sortedAsc.map((item) => {
            balance += item.credit - item.debit;
            return {
                date: item.date,
                credit: item.credit.toFixed(2),
                debit: item.debit.toFixed(2),
                balance: balance.toFixed(2)
            };
        });
        dataWithBalance.reverse();
        const total = dataWithBalance.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = dataWithBalance.slice(startIndex, endIndex);
        const totalCash = collections.reduce((sum, c) => sum + parseFloat(c.amount), 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        return {
            data: paginatedData,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            },
            summary: {
                totalCash,
                totalExpenses,
                currentBalance: balance
            }
        };
    }
};
exports.CashCollectionsService = CashCollectionsService;
exports.CashCollectionsService = CashCollectionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_installment_entity_1.PaymentInstallment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CashCollectionsService);
//# sourceMappingURL=cash-collections.service.js.map