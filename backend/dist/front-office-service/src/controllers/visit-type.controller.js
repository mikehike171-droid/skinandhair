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
exports.VisitTypeController = void 0;
const common_1 = require("@nestjs/common");
const visit_type_service_1 = require("../services/visit-type.service");
let VisitTypeController = class VisitTypeController {
    constructor(visitTypeService) {
        this.visitTypeService = visitTypeService;
    }
    async findAll() {
        return this.visitTypeService.findAll();
    }
};
exports.VisitTypeController = VisitTypeController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VisitTypeController.prototype, "findAll", null);
exports.VisitTypeController = VisitTypeController = __decorate([
    (0, common_1.Controller)('visit-type'),
    __metadata("design:paramtypes", [visit_type_service_1.VisitTypeService])
], VisitTypeController);
//# sourceMappingURL=visit-type.controller.js.map