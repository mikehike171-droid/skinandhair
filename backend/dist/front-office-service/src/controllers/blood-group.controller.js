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
exports.BloodGroupController = void 0;
const common_1 = require("@nestjs/common");
const blood_group_service_1 = require("../services/blood-group.service");
let BloodGroupController = class BloodGroupController {
    constructor(bloodGroupService) {
        this.bloodGroupService = bloodGroupService;
    }
    async findAll() {
        return this.bloodGroupService.findAll();
    }
};
exports.BloodGroupController = BloodGroupController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BloodGroupController.prototype, "findAll", null);
exports.BloodGroupController = BloodGroupController = __decorate([
    (0, common_1.Controller)('blood-group'),
    __metadata("design:paramtypes", [blood_group_service_1.BloodGroupService])
], BloodGroupController);
//# sourceMappingURL=blood-group.controller.js.map