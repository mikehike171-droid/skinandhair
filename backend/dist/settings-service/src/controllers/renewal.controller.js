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
exports.RenewalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const renewal_service_1 = require("../services/renewal.service");
let RenewalController = class RenewalController {
    constructor(renewalService) {
        this.renewalService = renewalService;
    }
    async getRenewalPatients(req, locationId, fromDate, toDate) {
        const userId = req.user?.user_id || req.user?.id;
        const locId = locationId ? parseInt(locationId) : req.user?.location_id || 1;
        return this.renewalService.getRenewalPatients(locId, fromDate, toDate);
    }
};
exports.RenewalController = RenewalController;
__decorate([
    (0, common_1.Get)('patients'),
    (0, swagger_1.ApiOperation)({ summary: 'Get patients with renewal dates' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('locationId')),
    __param(2, (0, common_1.Query)('fromDate')),
    __param(3, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], RenewalController.prototype, "getRenewalPatients", null);
exports.RenewalController = RenewalController = __decorate([
    (0, swagger_1.ApiTags)('Renewal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('renewal'),
    __metadata("design:paramtypes", [renewal_service_1.RenewalService])
], RenewalController);
//# sourceMappingURL=renewal.controller.js.map