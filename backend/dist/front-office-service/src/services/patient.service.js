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
exports.PatientService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_entity_1 = require("../entities/patient.entity");
const microservice_client_service_1 = require("./microservice-client.service");
let PatientService = class PatientService {
    constructor(patientRepository, microserviceClient) {
        this.patientRepository = patientRepository;
        this.microserviceClient = microserviceClient;
    }
    async onModuleInit() {
        await this.generateMissingPatientIds();
    }
    async generateMissingPatientIds() {
        const patientsWithoutId = await this.patientRepository.find({
            where: { patientId: null },
        });
        for (const patient of patientsWithoutId) {
            patient.patientId = await this.generatePatientId();
            await this.patientRepository.save(patient);
        }
    }
    async generatePatientId() {
        const year = new Date().getFullYear().toString().slice(-2);
        const lastPatient = await this.patientRepository
            .createQueryBuilder('patient')
            .where('patient.patient_unique_id IS NOT NULL')
            .orderBy('patient.id', 'DESC')
            .getOne();
        let sequence = 1;
        if (lastPatient?.patientId) {
            const lastSequence = parseInt(lastPatient.patientId.slice(-2));
            sequence = lastSequence + 1;
        }
        return `P${year}${sequence.toString().padStart(4, '0')}`;
    }
    async findAll() {
        return this.patientRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const patient = await this.patientRepository.findOne({
            where: { id },
        });
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with ID ${id} not found`);
        }
        return patient;
    }
    async searchPatients(query) {
        console.log('Search params:', { query });
        const whereConditions = [
            { firstName: (0, typeorm_2.Like)(`%${query}%`), isActive: true },
            { lastName: (0, typeorm_2.Like)(`%${query}%`), isActive: true },
            { phone: (0, typeorm_2.Like)(`%${query}%`), isActive: true },
            { patientId: (0, typeorm_2.Like)(`%${query}%`), isActive: true },
        ];
        console.log('Where conditions:', whereConditions);
        const filteredPatients = await this.patientRepository.find({
            where: whereConditions,
            take: 20,
        });
        console.log('Found patients:', filteredPatients.length);
        return filteredPatients.map(patient => ({
            id: patient.patientId || patient.id.toString(),
            name: `${patient.firstName} ${patient.lastName}`,
            age: this.calculateAge(patient.dateOfBirth),
            gender: patient.gender,
            phone: patient.phone,
            tokenNumber: `T${patient.id.toString().padStart(3, '0')}`,
            address: patient.address,
            allergies: patient.allergies ? patient.allergies.split(',').map(a => a.trim()) : []
        }));
    }
    calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    async getPatientHistory(patientId) {
        const patient = await this.findOne(patientId);
        try {
            const [appointments, bills, labOrders] = await Promise.all([
                this.microserviceClient.get('appointment', `/api/appointments?patientId=${patientId}`),
                this.microserviceClient.get('billing', `/api/bills?patientId=${patientId}`),
                this.microserviceClient.get('laboratory', `/api/lab-orders?patientId=${patientId}`),
            ]);
            return {
                patient,
                appointments: appointments || [],
                bills: bills || [],
                labOrders: labOrders || [],
            };
        }
        catch (error) {
            return {
                patient,
                appointments: [],
                bills: [],
                labOrders: [],
                error: 'Some services are unavailable',
            };
        }
    }
    async create(patientData) {
        const patient = this.patientRepository.create(patientData);
        if (!patient.patientId) {
            patient.patientId = await this.generatePatientId();
        }
        return this.patientRepository.save(patient);
    }
    async update(id, patientData) {
        await this.patientRepository.update(id, patientData);
        return this.findOne(id);
    }
    async getPatientStats() {
        const total = await this.patientRepository.count({
            where: { isActive: true }
        });
        const today = new Date().toISOString().split('T')[0];
        const newToday = await this.patientRepository
            .createQueryBuilder('patient')
            .where('DATE(patient.createdAt) = :today', { today })
            .getCount();
        return {
            totalPatients: total,
            newPatientsToday: newToday,
        };
    }
};
exports.PatientService = PatientService;
exports.PatientService = PatientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        microservice_client_service_1.MicroserviceClientService])
], PatientService);
//# sourceMappingURL=patient.service.js.map