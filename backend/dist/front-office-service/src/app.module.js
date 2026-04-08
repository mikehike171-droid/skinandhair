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
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const database_config_1 = require("./config/database.config");
const location_entity_1 = require("./entities/location.entity");
const patient_entity_1 = require("./entities/patient.entity");
const patient_queue_entity_1 = require("./entities/patient-queue.entity");
const patient_transfer_entity_1 = require("./entities/patient-transfer.entity");
const patient_support_ticket_entity_1 = require("./entities/patient-support-ticket.entity");
const gender_entity_1 = require("./entities/gender.entity");
const blood_group_entity_1 = require("./entities/blood-group.entity");
const marital_status_entity_1 = require("./entities/marital-status.entity");
const consultation_type_entity_1 = require("./entities/consultation-type.entity");
const visit_type_entity_1 = require("./entities/visit-type.entity");
const patient_category_entity_1 = require("./entities/patient-category.entity");
const patient_prescription_entity_1 = require("./entities/patient-prescription.entity");
const microservice_client_service_1 = require("./services/microservice-client.service");
const patient_service_1 = require("./services/patient.service");
const queue_service_1 = require("./services/queue.service");
const gender_service_1 = require("./services/gender.service");
const blood_group_service_1 = require("./services/blood-group.service");
const marital_status_service_1 = require("./services/marital-status.service");
const consultation_type_service_1 = require("./services/consultation-type.service");
const visit_type_service_1 = require("./services/visit-type.service");
const patient_category_service_1 = require("./services/patient-category.service");
const patient_prescription_service_1 = require("./services/patient-prescription.service");
const patient_controller_1 = require("./controllers/patient.controller");
const queue_controller_1 = require("./controllers/queue.controller");
const front_office_controller_1 = require("./controllers/front-office.controller");
const gender_controller_1 = require("./controllers/gender.controller");
const blood_group_controller_1 = require("./controllers/blood-group.controller");
const marital_status_controller_1 = require("./controllers/marital-status.controller");
const consultation_type_controller_1 = require("./controllers/consultation-type.controller");
const visit_type_controller_1 = require("./controllers/visit-type.controller");
const patient_category_controller_1 = require("./controllers/patient-category.controller");
const patient_prescription_controller_1 = require("./controllers/patient-prescription.controller");
const jwt_strategy_1 = require("./auth/jwt.strategy");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: database_config_1.getDatabaseConfig,
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([
                location_entity_1.Location,
                patient_entity_1.Patient,
                patient_queue_entity_1.PatientQueue,
                patient_transfer_entity_1.PatientTransfer,
                patient_support_ticket_entity_1.PatientSupportTicket,
                gender_entity_1.Gender,
                blood_group_entity_1.BloodGroup,
                marital_status_entity_1.MaritalStatus,
                consultation_type_entity_1.ConsultationType,
                visit_type_entity_1.VisitType,
                patient_category_entity_1.PatientCategory,
                patient_prescription_entity_1.PatientPrescription,
            ]),
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: '3I3zCSdmG2Qt8X0lHvKkC5fsQp8Wfpx9MFdECFs9CS9Cu97GMrrpdptIxsP8sYPr',
                signOptions: { expiresIn: '24h' },
            }),
        ],
        controllers: [
            patient_controller_1.PatientController,
            queue_controller_1.QueueController,
            front_office_controller_1.FrontOfficeController,
            gender_controller_1.GenderController,
            blood_group_controller_1.BloodGroupController,
            marital_status_controller_1.MaritalStatusController,
            consultation_type_controller_1.ConsultationTypeController,
            visit_type_controller_1.VisitTypeController,
            patient_category_controller_1.PatientCategoryController,
            patient_prescription_controller_1.PatientPrescriptionController,
        ],
        providers: [
            microservice_client_service_1.MicroserviceClientService,
            patient_service_1.PatientService,
            queue_service_1.QueueService,
            gender_service_1.GenderService,
            blood_group_service_1.BloodGroupService,
            marital_status_service_1.MaritalStatusService,
            consultation_type_service_1.ConsultationTypeService,
            visit_type_service_1.VisitTypeService,
            patient_category_service_1.PatientCategoryService,
            patient_prescription_service_1.PatientPrescriptionService,
            jwt_strategy_1.JwtStrategy,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map