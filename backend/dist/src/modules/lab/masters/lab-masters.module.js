"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabMastersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const units_controller_1 = require("./units.controller");
const units_service_1 = require("./units.service");
const investigations_controller_1 = require("./investigations.controller");
const investigations_service_1 = require("./investigations.service");
const unit_entity_1 = require("./entities/unit.entity");
const investigation_entity_1 = require("./entities/investigation.entity");
let LabMastersModule = class LabMastersModule {
};
exports.LabMastersModule = LabMastersModule;
exports.LabMastersModule = LabMastersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([unit_entity_1.Unit, investigation_entity_1.Investigation])],
        controllers: [units_controller_1.UnitsController, investigations_controller_1.InvestigationsController],
        providers: [units_service_1.UnitsService, investigations_service_1.InvestigationsService],
        exports: [units_service_1.UnitsService, investigations_service_1.InvestigationsService],
    })
], LabMastersModule);
//# sourceMappingURL=lab-masters.module.js.map