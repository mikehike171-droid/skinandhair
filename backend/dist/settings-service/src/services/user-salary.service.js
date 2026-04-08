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
exports.UserSalaryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_salary_details_entity_1 = require("../entities/user-salary-details.entity");
let UserSalaryService = class UserSalaryService {
    constructor(salaryRepository) {
        this.salaryRepository = salaryRepository;
    }
    async create(data) {
        const salary = this.salaryRepository.create(data);
        return this.salaryRepository.save(salary);
    }
    async findByUserId(userId) {
        return this.salaryRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }
};
exports.UserSalaryService = UserSalaryService;
exports.UserSalaryService = UserSalaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_salary_details_entity_1.UserSalaryDetails)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserSalaryService);
//# sourceMappingURL=user-salary.service.js.map