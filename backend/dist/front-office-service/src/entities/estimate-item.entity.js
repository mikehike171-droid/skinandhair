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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateItem = void 0;
const typeorm_1 = require("typeorm");
const estimate_entity_1 = require("./estimate.entity");
let EstimateItem = class EstimateItem {
};
exports.EstimateItem = EstimateItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EstimateItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimate_id' }),
    __metadata("design:type", Number)
], EstimateItem.prototype, "estimateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_name', length: 100 }),
    __metadata("design:type", String)
], EstimateItem.prototype, "itemName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_code', length: 50, nullable: true }),
    __metadata("design:type", String)
], EstimateItem.prototype, "itemCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], EstimateItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], EstimateItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], EstimateItem.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], EstimateItem.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estimate_entity_1.Estimate, estimate => estimate.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'estimate_id' }),
    __metadata("design:type", estimate_entity_1.Estimate)
], EstimateItem.prototype, "estimate", void 0);
exports.EstimateItem = EstimateItem = __decorate([
    (0, typeorm_1.Entity)('estimate_items')
], EstimateItem);
//# sourceMappingURL=estimate-item.entity.js.map