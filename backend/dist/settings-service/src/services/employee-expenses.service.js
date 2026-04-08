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
exports.EmployeeExpensesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_expense_entity_1 = require("../entities/employee-expense.entity");
let EmployeeExpensesService = class EmployeeExpensesService {
    constructor(employeeExpenseRepository) {
        this.employeeExpenseRepository = employeeExpenseRepository;
    }
    async findAllWithEmployees(fromDate, toDate, page = 1, limit = 10) {
        try {
            const query = this.employeeExpenseRepository
                .createQueryBuilder('expense')
                .leftJoin('users', 'user', 'user.id = expense.employeeId')
                .leftJoinAndSelect('expense.expenseCategory', 'category')
                .leftJoin('expense.approver', 'approver')
                .select([
                'expense.id as expense_id',
                'expense.employee_id as expense_employee_id',
                'expense.expense_category_id as expense_expense_category_id',
                'expense.location_id as expense_location_id',
                'expense.amount as expense_amount',
                'expense.description as expense_description',
                'expense.expense_date as expense_expense_date',
                'expense.receipt as expense_receipt',
                'expense.status as expense_status',
                'expense.approved_by as expense_approved_by',
                'expense.approved_at as expense_approved_at',
                'expense.rejection_reason as expense_rejection_reason',
                'expense.created_at as expense_created_at',
                'expense.updated_at as expense_updated_at',
                'user.id as user_id',
                'user.first_name as user_first_name',
                'user.last_name as user_last_name',
                'user.email as user_email',
                'approver.id as approver_id',
                'approver.first_name as approver_first_name',
                'approver.last_name as approver_last_name',
                'approver.email as approver_email',
                'category.id as category_id',
                'category.name as category_name',
                'category.description as category_description',
                'category.is_active as category_is_active'
            ])
                .orderBy('expense.created_at', 'DESC');
            if (fromDate) {
                query.andWhere('expense.expense_date >= :fromDate', { fromDate });
            }
            if (toDate) {
                query.andWhere('expense.expense_date <= :toDate', { toDate });
            }
            const countQuery = Object.assign(Object.create(Object.getPrototypeOf(query)), query);
            const totalRecords = await countQuery.select('COUNT(expense.id)', 'count').getRawOne();
            const skip = (page - 1) * limit;
            query.limit(limit).offset(skip);
            const result = await query.getRawMany();
            const data = result.map(raw => ({
                id: raw.expense_id,
                employeeId: raw.expense_employee_id,
                locationId: raw.expense_location_id,
                amount: raw.expense_amount,
                description: raw.expense_description,
                expenseDate: raw.expense_expense_date,
                receipt: raw.expense_receipt,
                status: raw.expense_status,
                approvedBy: raw.expense_approved_by,
                approvedAt: raw.expense_approved_at,
                rejectionReason: raw.expense_rejection_reason,
                createdAt: raw.expense_created_at,
                updatedAt: raw.expense_updated_at,
                expenseCategory: {
                    id: raw.category_id,
                    name: raw.category_name,
                    description: raw.category_description,
                    isActive: raw.category_is_active
                },
                employee: {
                    id: raw.user_id,
                    firstName: raw.user_first_name,
                    lastName: raw.user_last_name,
                    email: raw.user_email
                },
                approver: raw.approver_id ? {
                    id: raw.approver_id,
                    firstName: raw.approver_first_name,
                    lastName: raw.approver_last_name,
                    email: raw.approver_email
                } : null
            }));
            return {
                data,
                total: parseInt(totalRecords.count),
                page,
                limit,
                totalPages: Math.ceil(parseInt(totalRecords.count) / limit)
            };
        }
        catch (error) {
            console.error('Error in findAllWithEmployees:', error);
            return { data: [], total: 0, page, limit, totalPages: 0 };
        }
    }
    async findApprovedExpensesByLocation(locationId, status = 'approved') {
        try {
            const query = this.employeeExpenseRepository
                .createQueryBuilder('expense')
                .leftJoin('users', 'user', 'user.id = expense.employeeId')
                .leftJoinAndSelect('expense.expenseCategory', 'category')
                .select([
                'expense.id',
                'expense.amount',
                'expense.description',
                'expense.expense_date as expenseDate',
                'expense.status',
                'user.id as user_id',
                'user.first_name as user_first_name',
                'user.last_name as user_last_name',
                'category.id as category_id',
                'category.name as category_name'
            ])
                .where('expense.status = :status', { status })
                .orderBy('expense.expense_date', 'DESC');
            if (locationId) {
                query.andWhere('user.location_id = :locationId', { locationId });
            }
            const result = await query.getRawMany();
            return result.map(raw => ({
                id: raw.expense_id,
                amount: raw.expense_amount,
                description: raw.expense_description,
                expenseDate: raw.expenseDate,
                status: raw.expense_status,
                expenseCategory: {
                    id: raw.category_id,
                    name: raw.category_name
                },
                employee: {
                    id: raw.user_id,
                    firstName: raw.user_first_name,
                    lastName: raw.user_last_name
                }
            }));
        }
        catch (error) {
            console.error('Error in findApprovedExpensesByLocation:', error);
            return [];
        }
    }
    async findAll(employeeId) {
        try {
            console.log('Service findAll called with employeeId:', employeeId);
            const query = this.employeeExpenseRepository
                .createQueryBuilder('expense')
                .leftJoinAndSelect('expense.expenseCategory', 'category')
                .leftJoin('expense.approver', 'approver')
                .leftJoin('users', 'user', 'user.id = expense.employeeId')
                .addSelect(['approver.id', 'approver.firstName', 'approver.lastName', 'approver.email'])
                .addSelect(['user.id', 'user.firstName', 'user.lastName', 'user.email'])
                .orderBy('expense.createdAt', 'DESC');
            if (employeeId) {
                console.log('Adding WHERE clause for employeeId:', employeeId);
                query.where('expense.employeeId = :employeeId', { employeeId });
            }
            const expenses = await query.getMany();
            console.log('Found expenses:', expenses.length);
            return expenses.map(expense => ({
                id: expense.id,
                employeeId: expense.employeeId,
                expenseCategoryId: expense.expenseCategoryId,
                amount: expense.amount,
                description: expense.description,
                expenseDate: expense.expenseDate,
                receipt: expense.receipt,
                status: expense.status,
                approvedBy: expense.approvedBy,
                approvedAt: expense.approvedAt,
                rejectionReason: expense.rejectionReason,
                createdAt: expense.createdAt,
                updatedAt: expense.updatedAt,
                expenseCategory: {
                    id: expense.expenseCategory?.id,
                    name: expense.expenseCategory?.name,
                    description: expense.expenseCategory?.description,
                    isActive: expense.expenseCategory?.isActive
                },
                employee: {
                    id: expense.employeeId,
                    firstName: expense['user']?.firstName || 'N/A',
                    lastName: expense['user']?.lastName || 'N/A',
                    email: expense['user']?.email || 'N/A'
                },
                approver: expense.approver ? {
                    id: expense.approver.id,
                    firstName: expense.approver.firstName,
                    lastName: expense.approver.lastName,
                    email: expense.approver.email
                } : null
            }));
        }
        catch (error) {
            console.error('Error in findAll:', error);
            return [];
        }
    }
    async findOne(id) {
        const result = await this.employeeExpenseRepository
            .createQueryBuilder('expense')
            .leftJoin('users', 'user', 'user.id = expense.employeeId')
            .leftJoinAndSelect('expense.expenseCategory', 'category')
            .leftJoinAndSelect('expense.approver', 'approver')
            .select([
            'expense.*',
            'user.firstName as employeeFirstName',
            'user.lastName as employeeLastName',
            'user.email as employeeEmail',
            'category.*',
            'approver.*'
        ])
            .where('expense.id = :id', { id })
            .getRawAndEntities();
        if (!result.entities[0]) {
            throw new common_1.NotFoundException('Expense not found');
        }
        const expense = result.entities[0];
        const raw = result.raw[0];
        return {
            ...expense,
            employee: {
                id: expense.employeeId,
                firstName: raw.employeeFirstName,
                lastName: raw.employeeLastName,
                email: raw.employeeEmail
            }
        };
    }
    async getUserById(userId) {
        try {
            const user = await this.employeeExpenseRepository.query('SELECT primary_location_id as "primaryLocationId" FROM users WHERE id = $1', [userId]);
            return user[0] || null;
        }
        catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }
    async create(employeeId, createExpenseDto, locationId) {
        const expense = this.employeeExpenseRepository.create({
            ...createExpenseDto,
            employeeId,
            locationId,
            expenseDate: new Date(createExpenseDto.expenseDate)
        });
        return this.employeeExpenseRepository.save(expense);
    }
    async updateStatus(id, updateStatusDto, approverId) {
        console.log('Updating expense with ID:', id, 'to status:', updateStatusDto.status);
        const expense = await this.employeeExpenseRepository.findOne({ where: { id } });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        const updateResult = await this.employeeExpenseRepository.update(id, {
            status: updateStatusDto.status,
            approvedBy: approverId,
            approvedAt: new Date(),
            ...(updateStatusDto.status === employee_expense_entity_1.ExpenseStatus.REJECTED && updateStatusDto.rejectionReason && {
                rejectionReason: updateStatusDto.rejectionReason
            })
        });
        if (updateStatusDto.status === employee_expense_entity_1.ExpenseStatus.APPROVED && expense.locationId) {
            try {
                await this.employeeExpenseRepository.query(`INSERT INTO cash_balances (location_id, amount, transaction_type, description, created_at, updated_at)
           VALUES ($1, $2, 'debit', $3, NOW(), NOW())`, [expense.locationId, expense.amount, `Expense approved - ${expense.description || 'Employee expense'}`]);
            }
            catch (error) {
                console.error('Error updating cash balance:', error);
            }
        }
        console.log('Update result:', updateResult);
        return { success: true, message: 'Status updated successfully', affected: updateResult.affected };
    }
    async getExpensesSummary(employeeId) {
        const query = this.employeeExpenseRepository
            .createQueryBuilder('expense')
            .select([
            'expense.status as status',
            'COUNT(*) as count',
            'SUM(expense.amount) as total'
        ])
            .groupBy('expense.status');
        if (employeeId) {
            query.where('expense.employeeId = :employeeId', { employeeId });
        }
        return query.getRawMany();
    }
    async remove(id, employeeId) {
        const expense = await this.findOne(id);
        if (expense.employeeId !== employeeId) {
            throw new common_1.ForbiddenException('You can only delete your own expenses');
        }
        if (expense.status !== employee_expense_entity_1.ExpenseStatus.PENDING) {
            throw new common_1.ForbiddenException('Only pending expenses can be deleted');
        }
        await this.employeeExpenseRepository.delete(id);
    }
};
exports.EmployeeExpensesService = EmployeeExpensesService;
exports.EmployeeExpensesService = EmployeeExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_expense_entity_1.EmployeeExpense)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmployeeExpensesService);
//# sourceMappingURL=employee-expenses.service.js.map