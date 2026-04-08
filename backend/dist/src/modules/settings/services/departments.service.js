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
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const department_entity_1 = require("../entities/department.entity");
let DepartmentsService = class DepartmentsService {
    constructor(departmentRepository) {
        this.departmentRepository = departmentRepository;
    }
    async findAll() {
        return this.departmentRepository.find({
            where: { isActive: true },
            order: { name: 'ASC' }
        });
    }
    async findOne(id) {
        const department = await this.departmentRepository.findOne({ where: { id } });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID ${id} not found`);
        }
        return department;
    }
    async create(departmentData) {
        const department = this.departmentRepository.create(departmentData);
        return this.departmentRepository.save(department);
    }
    async update(id, departmentData) {
        await this.departmentRepository.update(id, departmentData);
        return this.findOne(id);
    }
    async findByLocationId(locationId) {
        try {
            console.log('Departments Service - locationId:', locationId);
            const ulpData = await this.departmentRepository.query('SELECT * FROM user_location_permissions WHERE location_id = $1', [locationId]);
            console.log('Debug - user_location_permissions data:', ulpData);
            const userData = await this.departmentRepository.query('SELECT id, first_name, last_name, is_active FROM users WHERE is_active = true');
            console.log('Debug - users data:', userData);
            const result = await this.departmentRepository
                .createQueryBuilder('dept')
                .leftJoin('user_location_permissions', 'ulp', 'ulp.department_id = dept.id AND ulp.location_id = :locationId')
                .leftJoin('users', 'u', 'u.id = ulp.user_id AND u.is_active = true')
                .select([
                'dept.id as id',
                'dept.name as name',
                'dept.description as description',
                'dept.head_of_department as "headOfDepartment"',
                'dept.location_id as "locationId"',
                'dept.is_active as "isActive"',
                'COUNT(DISTINCT u.id) as "staffCount"'
            ])
                .where('dept.location_id = :locationId', { locationId })
                .andWhere('dept.is_active = true')
                .groupBy('dept.id, dept.name, dept.description, dept.head_of_department, dept.location_id, dept.is_active')
                .orderBy('dept.name', 'ASC')
                .getRawMany();
            console.log('Departments Service - departments with staff count:', result);
            return result;
        }
        catch (error) {
            console.error('Departments Service error:', error);
            throw error;
        }
    }
    async remove(id) {
        const result = await this.departmentRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Department with ID ${id} not found`);
        }
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map