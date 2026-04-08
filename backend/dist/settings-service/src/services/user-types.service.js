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
exports.UserTypesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_type_entity_1 = require("../entities/user-type.entity");
let UserTypesService = class UserTypesService {
    constructor(userTypeRepository) {
        this.userTypeRepository = userTypeRepository;
    }
    async findAll() {
        return this.userTypeRepository.find({
            where: { isActive: true },
            order: { name: 'ASC' }
        });
    }
    async create(data) {
        const existing = await this.userTypeRepository.findOne({
            where: { code: data.code }
        });
        if (existing) {
            throw new common_1.ConflictException('User type code already exists');
        }
        const userType = this.userTypeRepository.create(data);
        return this.userTypeRepository.save(userType);
    }
    async update(id, data) {
        const userType = await this.userTypeRepository.findOne({ where: { id } });
        if (!userType) {
            throw new common_1.NotFoundException('User type not found');
        }
        await this.userTypeRepository.update(id, data);
        return this.userTypeRepository.findOne({ where: { id } });
    }
    async remove(id) {
        const userType = await this.userTypeRepository.findOne({ where: { id } });
        if (!userType) {
            throw new common_1.NotFoundException('User type not found');
        }
        await this.userTypeRepository.update(id, { isActive: false });
        return { message: 'User type deleted successfully' };
    }
};
exports.UserTypesService = UserTypesService;
exports.UserTypesService = UserTypesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_type_entity_1.UserType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserTypesService);
//# sourceMappingURL=user-types.service.js.map