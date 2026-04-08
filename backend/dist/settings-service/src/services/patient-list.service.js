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
exports.PatientListService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_entity_1 = require("../entities/patient.entity");
let PatientListService = class PatientListService {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
    }
    async getAllPatients(locationId, fromDate, toDate, page = 1, limit = 10, search) {
        console.log('Filters:', { fromDate, toDate, locationId, search });
        const queryBuilder = this.patientRepository.createQueryBuilder('patient')
            .leftJoin(qb => {
            return qb
                .select('pe.patient_id', 'patient_id')
                .addSelect('pe.next_renewal_date_pro', 'next_renewal_date_pro')
                .addSelect('pe.due_amount', 'due_amount')
                .from('patient_examination', 'pe')
                .where('pe.id IN (SELECT MAX(id) FROM patient_examination GROUP BY patient_id)');
        }, 'latest_exam', 'latest_exam.patient_id = patient.id')
            .leftJoin('locations', 'loc', 'patient.location_id = loc.id')
            .select([
            'patient.id',
            'patient.patient_id',
            'patient.salutation',
            'patient.first_name',
            'patient.middle_name',
            'patient.last_name',
            'patient.gender',
            'patient.date_of_birth',
            'patient.mobile',
            'patient.email',
            'patient.created_at',
            'patient.updated_at',
            'patient.status',
            'latest_exam.next_renewal_date_pro as next_renewal_date_pro',
            'latest_exam.due_amount as due_amount',
            'loc.name as location_name'
        ]);
        if (locationId && locationId !== 0) {
            queryBuilder.where('patient.location_id = :locationId', { locationId });
        }
        if (search) {
            const searchCondition = '(patient.patient_id LIKE :search OR patient.first_name ILIKE :search OR patient.last_name ILIKE :search OR patient.mobile LIKE :search)';
            if (locationId && locationId !== 0) {
                queryBuilder.andWhere(searchCondition, { search: `%${search}%` });
            }
            else {
                queryBuilder.where(searchCondition, { search: `%${search}%` });
            }
        }
        if (fromDate) {
            console.log('Adding fromDate filter:', fromDate);
            if (locationId && locationId !== 0 || search) {
                queryBuilder.andWhere('DATE(patient.created_at) >= :fromDate', { fromDate });
            }
            else {
                queryBuilder.where('DATE(patient.created_at) >= :fromDate', { fromDate });
            }
        }
        if (toDate) {
            console.log('Adding toDate filter:', toDate);
            if (locationId && locationId !== 0 || search || fromDate) {
                queryBuilder.andWhere('DATE(patient.created_at) <= :toDate', { toDate });
            }
            else {
                queryBuilder.where('DATE(patient.created_at) <= :toDate', { toDate });
            }
        }
        const total = await queryBuilder.getCount();
        const data = await queryBuilder
            .orderBy('patient.created_at', 'DESC')
            .offset((page - 1) * limit)
            .limit(limit)
            .getRawMany();
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async getPatientById(patientId, locationId, userId) {
        if (!userId) {
            throw new Error('User authentication required');
        }
        const numericId = parseInt(patientId);
        if (!isNaN(numericId)) {
            const patient = await this.patientRepository.findOne({
                where: { id: numericId }
            });
            if (patient)
                return patient;
        }
        return this.patientRepository.findOne({
            where: { patient_id: patientId }
        });
    }
    async getPatientsBySource(locationId, patientSourceId, fromDate, toDate) {
        const queryBuilder = this.patientRepository.createQueryBuilder('patient')
            .where('patient.location_id = :locationId', { locationId })
            .andWhere('patient.patient_source_id = :patientSourceId', { patientSourceId });
        if (fromDate) {
            queryBuilder.andWhere('DATE(patient.created_at) >= :fromDate', { fromDate });
        }
        if (toDate) {
            queryBuilder.andWhere('DATE(patient.created_at) <= :toDate', { toDate });
        }
        return queryBuilder.orderBy('patient.created_at', 'DESC').getMany();
    }
    async getRefPatients(locationId, page = 1, limit = 10) {
        const [data, total] = await this.patientRepository.createQueryBuilder('patient')
            .where('patient.location_id = :locationId', { locationId })
            .andWhere('patient.ref_patient_id IS NOT NULL')
            .orderBy('patient.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async getEmployeeRefPatients(locationId, page = 1, limit = 10) {
        const queryBuilder = this.patientRepository.createQueryBuilder('patient')
            .leftJoinAndSelect('users', 'referrer', 'patient.employee_ref_id = referrer.id')
            .where('patient.location_id = :locationId', { locationId })
            .andWhere('patient.employee_ref_id IS NOT NULL')
            .select([
            'patient.id as id',
            'patient.patient_id as patient_id',
            'patient.first_name as first_name',
            'patient.last_name as last_name',
            'patient.mobile as mobile',
            'patient.gender as gender',
            'patient.employee_ref_id as employee_ref_id',
            'patient.created_at as created_at',
            'patient.salutation as salutation',
            'referrer.first_name as referrer_first_name',
            'referrer.last_name as referrer_last_name'
        ])
            .orderBy('patient.created_at', 'DESC');
        const total = await queryBuilder.getCount();
        const data = await queryBuilder
            .offset((page - 1) * limit)
            .limit(limit)
            .getRawMany();
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
};
exports.PatientListService = PatientListService;
exports.PatientListService = PatientListService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PatientListService);
//# sourceMappingURL=patient-list.service.js.map