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
exports.HRPoliciesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hr_policy_entity_1 = require("../entities/hr-policy.entity");
let HRPoliciesService = class HRPoliciesService {
    constructor(hrPolicyRepository) {
        this.hrPolicyRepository = hrPolicyRepository;
    }
    async create(createDto) {
        const policy = this.hrPolicyRepository.create(createDto);
        return await this.hrPolicyRepository.save(policy);
    }
    async findAll(page = 1, limit = 10, search) {
        const query = this.hrPolicyRepository.createQueryBuilder('policy')
            .orderBy('policy.createdAt', 'DESC');
        if (search) {
            query.andWhere('(policy.title ILIKE :search OR policy.policyNumber ILIKE :search)', { search: `%${search}%` });
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        return await this.hrPolicyRepository.findOne({ where: { id } });
    }
    async update(id, updateDto) {
        await this.hrPolicyRepository.update(id, updateDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.hrPolicyRepository.delete(id);
    }
};
exports.HRPoliciesService = HRPoliciesService;
exports.HRPoliciesService = HRPoliciesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hr_policy_entity_1.HRPolicy)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HRPoliciesService);
//# sourceMappingURL=hr-policies.service.js.map