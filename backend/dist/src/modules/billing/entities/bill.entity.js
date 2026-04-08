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
exports.BillItem = exports.Bill = exports.PaymentMethod = exports.BillStatus = void 0;
const typeorm_1 = require("typeorm");
const patient_entity_1 = require("../../patients/entities/patient.entity");
const user_entity_1 = require("../../auth/entities/user.entity");
const location_entity_1 = require("../../locations/entities/location.entity");
var BillStatus;
(function (BillStatus) {
    BillStatus["DRAFT"] = "draft";
    BillStatus["PENDING"] = "pending";
    BillStatus["PAID"] = "paid";
    BillStatus["PARTIALLY_PAID"] = "partially_paid";
    BillStatus["CANCELLED"] = "cancelled";
})(BillStatus || (exports.BillStatus = BillStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["CARD"] = "card";
    PaymentMethod["UPI"] = "upi";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["INSURANCE"] = "insurance";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
let Bill = class Bill {
};
exports.Bill = Bill;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Bill.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bill_number', unique: true }),
    __metadata("design:type", String)
], Bill.prototype, "billNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_entity_1.Location),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    __metadata("design:type", location_entity_1.Location)
], Bill.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'location_id' }),
    __metadata("design:type", Number)
], Bill.prototype, "locationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => patient_entity_1.Patient),
    (0, typeorm_1.JoinColumn)({ name: 'patient_id' }),
    __metadata("design:type", patient_entity_1.Patient)
], Bill.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id' }),
    __metadata("design:type", Number)
], Bill.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Bill.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Bill.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Bill.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_amount', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Bill.prototype, "netAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paid_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Bill.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BillStatus, default: BillStatus.PENDING }),
    __metadata("design:type", String)
], Bill.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_method', type: 'enum', enum: PaymentMethod, nullable: true }),
    __metadata("design:type", String)
], Bill.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'insurance_claim_id', nullable: true }),
    __metadata("design:type", String)
], Bill.prototype, "insuranceClaimId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Bill.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", Number)
], Bill.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Bill.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Bill.prototype, "updatedAt", void 0);
exports.Bill = Bill = __decorate([
    (0, typeorm_1.Entity)('bills')
], Bill);
let BillItem = class BillItem {
};
exports.BillItem = BillItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BillItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Bill, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'bill_id' }),
    __metadata("design:type", Bill)
], BillItem.prototype, "bill", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bill_id' }),
    __metadata("design:type", Number)
], BillItem.prototype, "billId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_name' }),
    __metadata("design:type", String)
], BillItem.prototype, "itemName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_code' }),
    __metadata("design:type", String)
], BillItem.prototype, "itemCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], BillItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BillItem.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], BillItem.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BillItem.prototype, "category", void 0);
exports.BillItem = BillItem = __decorate([
    (0, typeorm_1.Entity)('bill_items')
], BillItem);
//# sourceMappingURL=bill.entity.js.map