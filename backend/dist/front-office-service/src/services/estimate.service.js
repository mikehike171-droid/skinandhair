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
exports.EstimateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const estimate_entity_1 = require("../entities/estimate.entity");
const estimate_item_entity_1 = require("../entities/estimate-item.entity");
const microservice_client_service_1 = require("./microservice-client.service");
let EstimateService = class EstimateService {
    constructor(estimateRepository, estimateItemRepository, microserviceClient) {
        this.estimateRepository = estimateRepository;
        this.estimateItemRepository = estimateItemRepository;
        this.microserviceClient = microserviceClient;
    }
    async create(createEstimateDto) {
        const { items, ...estimateData } = createEstimateDto;
        const estimateNumber = await this.generateEstimateNumber(createEstimateDto.locationId);
        const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const discountAmount = createEstimateDto.discountAmount || 0;
        const netAmount = totalAmount - discountAmount;
        const estimate = this.estimateRepository.create({
            ...estimateData,
            estimateNumber,
            totalAmount,
            discountAmount,
            netAmount,
        });
        const savedEstimate = await this.estimateRepository.save(estimate);
        const estimateItems = items.map(item => this.estimateItemRepository.create({
            ...item,
            estimateId: savedEstimate.id,
            totalPrice: item.quantity * item.unitPrice,
        }));
        await this.estimateItemRepository.save(estimateItems);
        return this.findOne(savedEstimate.id);
    }
    async findAll(locationId) {
        return this.estimateRepository.find({
            where: { locationId },
            relations: ['items', 'location'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const estimate = await this.estimateRepository.findOne({
            where: { id },
            relations: ['items', 'location'],
        });
        if (!estimate) {
            throw new common_1.NotFoundException(`Estimate with ID ${id} not found`);
        }
        return estimate;
    }
    async updateStatus(id, status) {
        await this.estimateRepository.update(id, { status });
        return this.findOne(id);
    }
    async convertToBill(id, userId) {
        const estimate = await this.findOne(id);
        const billData = {
            locationId: estimate.locationId,
            patientId: estimate.patientId,
            totalAmount: estimate.totalAmount,
            discountAmount: estimate.discountAmount,
            netAmount: estimate.netAmount,
            createdBy: userId,
            items: estimate.items.map(item => ({
                itemName: item.itemName,
                itemCode: item.itemCode,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                category: item.category,
            })),
        };
        const bill = await this.microserviceClient.createBill(billData);
        await this.updateStatus(id, 'accepted');
        return bill;
    }
    async generateEstimateNumber(locationId) {
        const count = await this.estimateRepository.count({ where: { locationId } });
        return `EST${locationId.toString().padStart(3, '0')}${(count + 1).toString().padStart(6, '0')}`;
    }
};
exports.EstimateService = EstimateService;
exports.EstimateService = EstimateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(estimate_entity_1.Estimate)),
    __param(1, (0, typeorm_1.InjectRepository)(estimate_item_entity_1.EstimateItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        microservice_client_service_1.MicroserviceClientService])
], EstimateService);
//# sourceMappingURL=estimate.service.js.map