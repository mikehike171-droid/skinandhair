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
exports.AppointmentTypeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_type_entity_1 = require("../entities/appointment-type.entity");
let AppointmentTypeService = class AppointmentTypeService {
    constructor(appointmentTypeRepository) {
        this.appointmentTypeRepository = appointmentTypeRepository;
    }
    async findAll(locationId) {
        const queryBuilder = this.appointmentTypeRepository
            .createQueryBuilder('appointmentType')
            .where('appointmentType.is_active = :isActive', { isActive: true });
        if (locationId) {
            queryBuilder.andWhere('(appointmentType.location_id = :locationId OR appointmentType.location_id IS NULL)', { locationId });
        }
        return queryBuilder
            .orderBy('appointmentType.name', 'ASC')
            .getMany();
    }
    async findOne(id) {
        return this.appointmentTypeRepository.findOne({
            where: { id, is_active: true }
        });
    }
    async create(appointmentTypeData) {
        const appointmentType = this.appointmentTypeRepository.create(appointmentTypeData);
        return this.appointmentTypeRepository.save(appointmentType);
    }
    async update(id, appointmentTypeData) {
        await this.appointmentTypeRepository.update(id, appointmentTypeData);
        return this.findOne(id);
    }
    async delete(id) {
        await this.appointmentTypeRepository.update(id, { is_active: false });
    }
};
exports.AppointmentTypeService = AppointmentTypeService;
exports.AppointmentTypeService = AppointmentTypeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_type_entity_1.AppointmentType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AppointmentTypeService);
//# sourceMappingURL=appointment-type.service.js.map