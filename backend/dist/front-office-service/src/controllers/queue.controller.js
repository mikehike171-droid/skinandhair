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
exports.QueueController = void 0;
const common_1 = require("@nestjs/common");
const queue_service_1 = require("../services/queue.service");
const create_queue_token_dto_1 = require("../dto/create-queue-token.dto");
let QueueController = class QueueController {
    constructor(queueService) {
        this.queueService = queueService;
    }
    createToken(createQueueTokenDto) {
        return this.queueService.createToken(createQueueTokenDto);
    }
    findAll(locationId, status) {
        return this.queueService.findAll(locationId, status);
    }
    findOne(id) {
        return this.queueService.findOne(id);
    }
    callNext(locationId, department) {
        return this.queueService.callNext(locationId, department);
    }
    updateStatus(id, status) {
        return this.queueService.updateStatus(id, status);
    }
    getStats(locationId) {
        return this.queueService.getQueueStats(locationId);
    }
};
exports.QueueController = QueueController;
__decorate([
    (0, common_1.Post)('tokens'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_queue_token_dto_1.CreateQueueTokenDto]),
    __metadata("design:returntype", void 0)
], QueueController.prototype, "createToken", null);
__decorate([
    (0, common_1.Get)('tokens'),
    __param(0, (0, common_1.Query)('locationId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], QueueController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tokens/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], QueueController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('call-next'),
    __param(0, (0, common_1.Body)('locationId')),
    __param(1, (0, common_1.Body)('department')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], QueueController.prototype, "callNext", null);
__decorate([
    (0, common_1.Put)('tokens/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], QueueController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], QueueController.prototype, "getStats", null);
exports.QueueController = QueueController = __decorate([
    (0, common_1.Controller)('api/queue'),
    __metadata("design:paramtypes", [queue_service_1.QueueService])
], QueueController);
//# sourceMappingURL=queue.controller.js.map