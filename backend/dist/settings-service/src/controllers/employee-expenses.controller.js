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
exports.EmployeeExpensesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const employee_expenses_service_1 = require("../services/employee-expenses.service");
const expense_dto_1 = require("../dto/expense.dto");
const multer_1 = require("multer");
const path_1 = require("path");
let EmployeeExpensesController = class EmployeeExpensesController {
    constructor(employeeExpensesService) {
        this.employeeExpensesService = employeeExpensesService;
    }
    updateExpenseStatus(id, updateStatusDto) {
        return this.employeeExpensesService.updateStatus(+id, updateStatusDto, 1);
    }
    findAll(req, employeeId) {
        const targetEmployeeId = req.user.id;
        return this.employeeExpensesService.findAll(targetEmployeeId);
    }
    getExpensesSummary(req, employeeId) {
        const targetEmployeeId = employeeId ? +employeeId : req.user.id;
        return this.employeeExpensesService.getExpensesSummary(targetEmployeeId);
    }
    findAllExpenses(fromDate, toDate, page, limit) {
        return this.employeeExpensesService.findAllWithEmployees(fromDate, toDate, page ? +page : 1, limit ? +limit : 10);
    }
    findApprovedExpensesByLocation(locationId, status) {
        return this.employeeExpensesService.findApprovedExpensesByLocation(locationId ? +locationId : undefined, status || 'approved');
    }
    findOne(id) {
        return this.employeeExpensesService.findOne(+id);
    }
    async create(req, createExpenseDto, file) {
        const user = await this.employeeExpensesService.getUserById(req.user.id);
        const locationId = user?.primaryLocationId || 1;
        const receiptFilename = file ? `uploads/expenses/${file.filename}` : createExpenseDto.receipt;
        return this.employeeExpensesService.create(req.user.id, { ...createExpenseDto, receipt: receiptFilename }, locationId);
    }
    remove(id, req) {
        return this.employeeExpensesService.remove(+id, req.user.id);
    }
};
exports.EmployeeExpensesController = EmployeeExpensesController;
__decorate([
    (0, common_1.Put)('update-status/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, expense_dto_1.UpdateExpenseStatusDto]),
    __metadata("design:returntype", void 0)
], EmployeeExpensesController.prototype, "updateExpenseStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EmployeeExpensesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], EmployeeExpensesController.prototype, "getExpensesSummary", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('all'),
    __param(0, (0, common_1.Query)('fromDate')),
    __param(1, (0, common_1.Query)('toDate')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], EmployeeExpensesController.prototype, "findAllExpenses", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('location'),
    __param(0, (0, common_1.Query)('locationId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EmployeeExpensesController.prototype, "findApprovedExpensesByLocation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmployeeExpensesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('receipt', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const fs = require('fs');
                const uploadPath = './uploads/expenses';
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, 'expense-' + uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, expense_dto_1.CreateExpenseDto, Object]),
    __metadata("design:returntype", Promise)
], EmployeeExpensesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EmployeeExpensesController.prototype, "remove", null);
exports.EmployeeExpensesController = EmployeeExpensesController = __decorate([
    (0, common_1.Controller)('employee-expenses'),
    __metadata("design:paramtypes", [employee_expenses_service_1.EmployeeExpensesService])
], EmployeeExpensesController);
//# sourceMappingURL=employee-expenses.controller.js.map