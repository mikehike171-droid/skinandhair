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
exports.InvestigationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const investigation_entity_1 = require("./entities/investigation.entity");
let InvestigationsService = class InvestigationsService {
    constructor(investigationsRepository) {
        this.investigationsRepository = investigationsRepository;
    }
    async findAll(locationId) {
        const queryBuilder = this.investigationsRepository.createQueryBuilder('investigation')
            .leftJoin('units', 'unit', 'investigation.unit_id = unit.id')
            .select([
            'investigation.id as id',
            'investigation.code as code',
            'investigation.description as description',
            'investigation.method as method',
            'investigation.unit_id as unitId',
            'investigation.result_type as resultType',
            'investigation.default_value as defaultValue',
            'investigation.location_id as locationId',
            'investigation.status as status',
            'investigation.created_at as createdAt',
            'investigation.updated_at as updatedAt',
            'unit.description as unitDescription'
        ]);
        if (locationId) {
            queryBuilder.where('investigation.location_id = :locationId', { locationId });
        }
        return queryBuilder.orderBy('investigation.id', 'ASC').getRawMany();
    }
    async create(createInvestigationDto) {
        const investigation = this.investigationsRepository.create({
            code: createInvestigationDto.code,
            description: createInvestigationDto.description,
            method: createInvestigationDto.method,
            unitId: createInvestigationDto.unitId,
            resultType: createInvestigationDto.resultType,
            defaultValue: createInvestigationDto.defaultValue,
            locationId: createInvestigationDto.locationId,
            status: createInvestigationDto.isActive ? '1' : '0',
        });
        return this.investigationsRepository.save(investigation);
    }
    async update(id, updateInvestigationDto) {
        const investigation = await this.investigationsRepository.findOne({ where: { id } });
        if (!investigation) {
            throw new Error('Investigation not found');
        }
        if (updateInvestigationDto.code)
            investigation.code = updateInvestigationDto.code;
        if (updateInvestigationDto.description)
            investigation.description = updateInvestigationDto.description;
        if (updateInvestigationDto.method !== undefined)
            investigation.method = updateInvestigationDto.method;
        if (updateInvestigationDto.unitId !== undefined)
            investigation.unitId = updateInvestigationDto.unitId;
        if (updateInvestigationDto.resultType !== undefined)
            investigation.resultType = updateInvestigationDto.resultType;
        if (updateInvestigationDto.defaultValue !== undefined)
            investigation.defaultValue = updateInvestigationDto.defaultValue;
        if (updateInvestigationDto.locationId)
            investigation.locationId = updateInvestigationDto.locationId;
        if (updateInvestigationDto.isActive !== undefined)
            investigation.status = updateInvestigationDto.isActive ? '1' : '0';
        return this.investigationsRepository.save(investigation);
    }
    async remove(id) {
        const result = await this.investigationsRepository.delete(id);
        if (result.affected === 0) {
            throw new Error('Investigation not found');
        }
    }
};
exports.InvestigationsService = InvestigationsService;
exports.InvestigationsService = InvestigationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(investigation_entity_1.Investigation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InvestigationsService);
//# sourceMappingURL=investigations.service.js.map