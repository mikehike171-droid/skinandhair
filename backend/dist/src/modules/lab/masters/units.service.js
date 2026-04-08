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
exports.UnitsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const unit_entity_1 = require("./entities/unit.entity");
let UnitsService = class UnitsService {
    constructor(unitsRepository) {
        this.unitsRepository = unitsRepository;
    }
    async findAll(locationId) {
        const where = locationId ? { locationId } : {};
        return this.unitsRepository.find({
            where,
            order: { id: 'ASC' }
        });
    }
    async create(createUnitDto) {
        const unit = this.unitsRepository.create({
            code: createUnitDto.code,
            description: createUnitDto.description,
            status: createUnitDto.isActive ? '1' : '0',
            locationId: createUnitDto.locationId,
        });
        return this.unitsRepository.save(unit);
    }
    async update(id, updateUnitDto) {
        const unit = await this.unitsRepository.findOne({ where: { id } });
        if (!unit) {
            throw new Error('Unit not found');
        }
        if (updateUnitDto.code)
            unit.code = updateUnitDto.code;
        if (updateUnitDto.description)
            unit.description = updateUnitDto.description;
        if (updateUnitDto.isActive !== undefined)
            unit.status = updateUnitDto.isActive ? '1' : '0';
        if (updateUnitDto.locationId)
            unit.locationId = updateUnitDto.locationId;
        return this.unitsRepository.save(unit);
    }
    async remove(id) {
        const result = await this.unitsRepository.delete(id);
        if (result.affected === 0) {
            throw new Error('Unit not found');
        }
    }
};
exports.UnitsService = UnitsService;
exports.UnitsService = UnitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(unit_entity_1.Unit)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UnitsService);
//# sourceMappingURL=units.service.js.map