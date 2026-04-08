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
        const departments = await this.departmentRepository.find({
            where: { isActive: true },
            order: { name: 'ASC' }
        });
        return departments.map(dept => ({
            ...dept,
            staffCount: 0
        }));
    }
    async findOne(id) {
        const department = await this.departmentRepository.findOne({ where: { id } });
        if (!department) {
            throw new common_1.NotFoundException(`Department with ID ${id} not found`);
        }
        return department;
    }
    async create(departmentData) {
        const existingDept = await this.departmentRepository.findOne({
            where: {
                name: departmentData.name,
                locationId: departmentData.locationId,
                isActive: true
            }
        });
        if (existingDept) {
            throw new common_1.BadRequestException('Department name already exists in this location');
        }
        const department = this.departmentRepository.create(departmentData);
        return await this.departmentRepository.save(department);
    }
    async update(id, departmentData) {
        if (departmentData.name) {
            const currentDept = await this.findOne(id);
            const existingDept = await this.departmentRepository.findOne({
                where: {
                    name: departmentData.name,
                    locationId: currentDept.locationId,
                    isActive: true
                }
            });
            if (existingDept && existingDept.id !== id) {
                throw new common_1.BadRequestException('Department name already exists in this location');
            }
        }
        await this.departmentRepository.update(id, departmentData);
        return this.findOne(id);
    }
    async findByLocationId(locationId) {
        try {
            const departments = await this.departmentRepository.find({
                where: {
                    locationId: locationId,
                    isActive: true
                },
                order: { name: 'ASC' }
            });
            const ulpData = await this.departmentRepository.query('SELECT * FROM user_location_permissions WHERE location_id = $1', [locationId]);
            const userData = await this.departmentRepository.query('SELECT id, first_name, last_name, is_active FROM users WHERE is_active = true');
            const result = await Promise.all(departments.map(async (dept) => {
                try {
                    const staffCountResult = await this.departmentRepository.query('SELECT COUNT(DISTINCT ulp.user_id) as count FROM user_location_permissions ulp INNER JOIN users u ON u.id = ulp.user_id WHERE ulp.department_id = $1 AND ulp.location_id = $2 AND u.is_active = true', [dept.id, locationId]);
                    const staffCount = parseInt(staffCountResult[0]?.count || '0');
                    return {
                        ...dept,
                        staffCount
                    };
                }
                catch (error) {
                    console.error('Error getting staff count for dept', dept.id, error);
                    return {
                        ...dept,
                        staffCount: 0
                    };
                }
            }));
            return result;
        }
        catch (error) {
            console.error('Departments Service error:', error);
            throw error;
        }
    }
    async remove(id) {
        const department = await this.findOne(id);
        await this.departmentRepository.update(id, { isActive: false });
        return this.findOne(id);
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map