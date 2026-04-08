"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const database_config_1 = require("./config/database.config");
const doctors_controller_1 = require("./controllers/doctors.controller");
const doctors_service_1 = require("./services/doctors.service");
const doctor_timeslot_entity_1 = require("./entities/doctor-timeslot.entity");
const user_entity_1 = require("./entities/user.entity");
const doctor_consultation_fee_entity_1 = require("./entities/doctor-consultation-fee.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useClass: database_config_1.DatabaseConfig,
            }),
            typeorm_1.TypeOrmModule.forFeature([doctor_timeslot_entity_1.DoctorTimeslot, user_entity_1.User, doctor_consultation_fee_entity_1.DoctorConsultationFee]),
        ],
        controllers: [doctors_controller_1.DoctorsController],
        providers: [doctors_service_1.DoctorsService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map