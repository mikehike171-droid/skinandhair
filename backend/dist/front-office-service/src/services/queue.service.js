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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_queue_entity_1 = require("../entities/patient-queue.entity");
const microservice_client_service_1 = require("./microservice-client.service");
let QueueService = class QueueService {
    constructor(queueRepository, microserviceClient) {
        this.queueRepository = queueRepository;
        this.microserviceClient = microserviceClient;
    }
    async createToken(createQueueTokenDto) {
        const queueNumber = await this.generateQueueNumber(createQueueTokenDto.locationId);
        const estimatedTime = await this.calculateWaitTime(createQueueTokenDto.locationId, createQueueTokenDto.department);
        const queueToken = this.queueRepository.create({
            ...createQueueTokenDto,
            queueNumber,
            estimatedTime,
            queueType: createQueueTokenDto.department || 'consultation',
        });
        return this.queueRepository.save(queueToken);
    }
    async findAll(locationId, status) {
        const where = { locationId };
        if (status) {
            where.status = status;
        }
        return this.queueRepository.find({
            where,
            relations: ['location', 'patient'],
            order: { createdAt: 'ASC' },
        });
    }
    async findOne(id) {
        const token = await this.queueRepository.findOne({
            where: { id },
            relations: ['location', 'patient'],
        });
        if (!token) {
            throw new common_1.NotFoundException(`Queue token with ID ${id} not found`);
        }
        return token;
    }
    async callNext(locationId, department) {
        const where = { locationId, status: 'waiting' };
        if (department) {
            where.queueType = department;
        }
        const nextToken = await this.queueRepository.findOne({
            where,
            order: { createdAt: 'ASC' },
        });
        if (!nextToken) {
            throw new common_1.NotFoundException('No waiting tokens found');
        }
        nextToken.status = 'in_progress';
        nextToken.actualTime = new Date();
        return this.queueRepository.save(nextToken);
    }
    async updateStatus(id, status) {
        const token = await this.findOne(id);
        token.status = status;
        if (status === 'completed') {
            token.actualTime = new Date();
        }
        return this.queueRepository.save(token);
    }
    async getQueueStats(locationId) {
        const total = await this.queueRepository.count({ where: { locationId } });
        const waiting = await this.queueRepository.count({
            where: { locationId, status: 'waiting' }
        });
        const inProgress = await this.queueRepository.count({
            where: { locationId, status: 'in_progress' }
        });
        const completed = await this.queueRepository.count({
            where: { locationId, status: 'completed' }
        });
        return {
            total,
            waiting,
            inProgress,
            completed,
            averageWaitTime: await this.getAverageWaitTime(locationId),
        };
    }
    async generateQueueNumber(locationId) {
        const today = new Date().toISOString().split('T')[0];
        const count = await this.queueRepository
            .createQueryBuilder('queue')
            .where('queue.locationId = :locationId', { locationId })
            .andWhere('DATE(queue.createdAt) = :today', { today })
            .getCount();
        return count + 1;
    }
    async calculateWaitTime(locationId, department) {
        const where = { locationId, status: 'waiting' };
        if (department) {
            where.queueType = department;
        }
        const waitingCount = await this.queueRepository.count({ where });
        const estimatedMinutes = waitingCount * 15;
        const estimatedTime = new Date();
        estimatedTime.setMinutes(estimatedTime.getMinutes() + estimatedMinutes);
        return estimatedTime;
    }
    async getAverageWaitTime(locationId) {
        const result = await this.queueRepository
            .createQueryBuilder('queue')
            .select('AVG(EXTRACT(EPOCH FROM (queue.actualTime - queue.createdAt))/60)', 'avgWaitTime')
            .where('queue.locationId = :locationId', { locationId })
            .andWhere('queue.actualTime IS NOT NULL')
            .getRawOne();
        return Math.round(result?.avgWaitTime || 0);
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_queue_entity_1.PatientQueue)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        microservice_client_service_1.MicroserviceClientService])
], QueueService);
//# sourceMappingURL=queue.service.js.map