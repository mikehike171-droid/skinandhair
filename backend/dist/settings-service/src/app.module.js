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
const jwt_strategy_1 = require("./auth/jwt.strategy");
const auth_controller_1 = require("./controllers/auth.controller");
const users_controller_1 = require("./controllers/users.controller");
const roles_controller_1 = require("./controllers/roles.controller");
const departments_controller_1 = require("./controllers/departments.controller");
const departments_public_controller_1 = require("./controllers/departments-public.controller");
const locations_controller_1 = require("./controllers/locations.controller");
const locations_public_controller_1 = require("./controllers/locations-public.controller");
const locations_management_controller_1 = require("./controllers/locations-management.controller");
const permissions_controller_1 = require("./controllers/permissions.controller");
const modules_controller_1 = require("./controllers/modules.controller");
const test_controller_1 = require("./controllers/test.controller");
const doctors_controller_1 = require("./controllers/doctors.controller");
const attendance_controller_1 = require("./controllers/attendance.controller");
const queue_controller_1 = require("./controllers/queue.controller");
const auth_service_1 = require("./services/auth.service");
const users_service_1 = require("./services/users.service");
const roles_service_1 = require("./services/roles.service");
const departments_service_1 = require("./services/departments.service");
const locations_service_1 = require("./services/locations.service");
const permissions_service_1 = require("./services/permissions.service");
const modules_service_1 = require("./services/modules.service");
const doctors_service_1 = require("./services/doctors.service");
const attendance_service_1 = require("./services/attendance.service");
const queue_service_1 = require("./services/queue.service");
const user_entity_1 = require("./entities/user.entity");
const user_info_entity_1 = require("./entities/user-info.entity");
const user_location_permission_entity_1 = require("./entities/user-location-permission.entity");
const role_entity_1 = require("./entities/role.entity");
const department_entity_1 = require("./entities/department.entity");
const location_entity_1 = require("./entities/location.entity");
const user_access_entity_1 = require("./entities/user-access.entity");
const module_entity_1 = require("./entities/module.entity");
const sub_module_entity_1 = require("./entities/sub-module.entity");
const permission_entity_1 = require("./entities/permission.entity");
const doctor_timeslot_entity_1 = require("./entities/doctor-timeslot.entity");
const doctor_consultation_fee_entity_1 = require("./entities/doctor-consultation-fee.entity");
const attendance_entity_1 = require("./entities/attendance.entity");
const system_setting_entity_1 = require("./entities/system-setting.entity");
const user_status_entity_1 = require("./entities/user-status.entity");
const profile_controller_1 = require("./controllers/profile.controller");
const profile_service_1 = require("./services/profile.service");
const system_settings_controller_1 = require("./controllers/system-settings.controller");
const system_settings_service_1 = require("./services/system-settings.service");
const user_status_controller_1 = require("./controllers/user-status.controller");
const user_status_service_1 = require("./services/user-status.service");
const user_location_service_1 = require("./services/user-location.service");
const blood_group_controller_1 = require("./controllers/blood-group.controller");
const gender_controller_1 = require("./controllers/gender.controller");
const marital_status_controller_1 = require("./controllers/marital-status.controller");
const patient_registration_controller_1 = require("./controllers/patient-registration.controller");
const patient_auth_controller_1 = require("./controllers/patient-auth.controller");
const patient_appointments_controller_1 = require("./controllers/patient-appointments.controller");
const patient_source_controller_1 = require("./controllers/patient-source.controller");
const fee_masters_controller_1 = require("./controllers/fee-masters.controller");
const appointment_controller_1 = require("./controllers/appointment.controller");
const consultation_module_1 = require("./modules/consultation.module");
const blood_group_service_1 = require("./services/blood-group.service");
const gender_service_1 = require("./services/gender.service");
const marital_status_service_1 = require("./services/marital-status.service");
const patient_registration_service_1 = require("./services/patient-registration.service");
const patient_list_service_1 = require("./services/patient-list.service");
const patient_source_service_1 = require("./services/patient-source.service");
const fee_masters_service_1 = require("./services/fee-masters.service");
const appointment_service_1 = require("./services/appointment.service");
const medical_history_controller_1 = require("./controllers/medical-history.controller");
const medical_history_service_1 = require("./services/medical-history.service");
const personal_history_controller_1 = require("./controllers/personal-history.controller");
const personal_history_service_1 = require("./services/personal-history.service");
const lifestyle_controller_1 = require("./controllers/lifestyle.controller");
const lifestyle_service_1 = require("./services/lifestyle.service");
const family_history_controller_1 = require("./controllers/family-history.controller");
const family_history_service_1 = require("./services/family-history.service");
const drug_history_controller_1 = require("./controllers/drug-history.controller");
const drug_history_service_1 = require("./services/drug-history.service");
const allergies_controller_1 = require("./controllers/allergies.controller");
const allergies_service_1 = require("./services/allergies.service");
const social_history_controller_1 = require("./controllers/social-history.controller");
const social_history_service_1 = require("./services/social-history.service");
const prescription_controller_1 = require("./controllers/prescription.controller");
const prescription_service_1 = require("./services/prescription.service");
const diet_chart_controller_1 = require("./controllers/diet-chart.controller");
const diet_chart_service_1 = require("./services/diet-chart.service");
const patient_examination_controller_1 = require("./controllers/patient-examination.controller");
const patient_examination_service_1 = require("./services/patient-examination.service");
const treatment_plan_month_controller_1 = require("./controllers/treatment-plan-month.controller");
const treatment_plan_month_service_1 = require("./services/treatment-plan-month.service");
const treatment_plans_controller_1 = require("./controllers/treatment-plans.controller");
const treatment_plans_service_1 = require("./services/treatment-plans.service");
const telecaller_controller_1 = require("./controllers/telecaller.controller");
const telecaller_service_1 = require("./services/telecaller.service");
const user_types_controller_1 = require("./controllers/user-types.controller");
const user_types_service_1 = require("./services/user-types.service");
const appointment_type_controller_1 = require("./controllers/appointment-type.controller");
const appointment_type_service_1 = require("./services/appointment-type.service");
const mobile_call_controller_1 = require("./controllers/mobile-call.controller");
const presenting_complaints_controller_1 = require("./controllers/presenting-complaints.controller");
const mobile_numbers_controller_1 = require("./controllers/mobile-numbers.controller");
const mobile_numbers_service_1 = require("./services/mobile-numbers.service");
const mobile_number_entity_1 = require("./entities/mobile-number.entity");
const mobile_number_next_call_entity_1 = require("./entities/mobile-number-next-call.entity");
const mobile_assign_controller_1 = require("./controllers/mobile-assign.controller");
const mobile_assign_service_1 = require("./services/mobile-assign.service");
const mobile_call_tracking_controller_1 = require("./controllers/mobile-call-tracking.controller");
const mobile_call_tracking_service_1 = require("./services/mobile-call-tracking.service");
const renewal_controller_1 = require("./controllers/renewal.controller");
const renewal_service_1 = require("./services/renewal.service");
const presenting_complaints_service_1 = require("./services/presenting-complaints.service");
const blood_group_entity_1 = require("./entities/blood-group.entity");
const gender_entity_1 = require("./entities/gender.entity");
const marital_status_entity_1 = require("./entities/marital-status.entity");
const patient_entity_1 = require("./entities/patient.entity");
const patient_source_entity_1 = require("./entities/patient-source.entity");
const fee_masters_entity_1 = require("./entities/fee-masters.entity");
const doctor_entity_1 = require("./entities/doctor.entity");
const appointment_entity_1 = require("./entities/appointment.entity");
const patient_examination_entity_1 = require("./entities/patient-examination.entity");
const payment_installment_entity_1 = require("./entities/payment-installment.entity");
const treatment_plan_month_entity_1 = require("./entities/treatment-plan-month.entity");
const treatment_plan_entity_1 = require("./entities/treatment-plan.entity");
const call_history_entity_1 = require("./entities/call-history.entity");
const user_type_entity_1 = require("./entities/user-type.entity");
const appointment_type_entity_1 = require("./entities/appointment-type.entity");
const payment_type_entity_1 = require("./entities/payment-type.entity");
const call_history_controller_1 = require("./controllers/call-history.controller");
const call_history_service_1 = require("./services/call-history.service");
const payment_type_controller_1 = require("./controllers/payment-type.controller");
const payment_type_service_1 = require("./services/payment-type.service");
const expense_categories_controller_1 = require("./controllers/expense-categories.controller");
const employee_expenses_controller_1 = require("./controllers/employee-expenses.controller");
const today_collections_controller_1 = require("./controllers/today-collections.controller");
const cash_collections_controller_1 = require("./controllers/cash-collections.controller");
const locationsip_controller_1 = require("./controllers/locationsip.controller");
const holidays_controller_1 = require("./controllers/holidays.controller");
const salary_calculation_controller_1 = require("./controllers/salary-calculation.controller");
const salary_calculation_service_1 = require("./services/salary-calculation.service");
const user_salary_controller_1 = require("./controllers/user-salary.controller");
const user_salary_service_1 = require("./services/user-salary.service");
const user_salary_details_entity_1 = require("./entities/user-salary-details.entity");
const expense_categories_service_1 = require("./services/expense-categories.service");
const locationsip_service_1 = require("./services/locationsip.service");
const holidays_service_1 = require("./services/holidays.service");
const employee_expenses_service_1 = require("./services/employee-expenses.service");
const today_collections_service_1 = require("./services/today-collections.service");
const cash_collections_service_1 = require("./services/cash-collections.service");
const expense_category_entity_1 = require("./entities/expense-category.entity");
const employee_expense_entity_1 = require("./entities/employee-expense.entity");
const holiday_entity_1 = require("./entities/holiday.entity");
const hr_policy_entity_1 = require("./entities/hr-policy.entity");
const hr_policies_controller_1 = require("./controllers/hr-policies.controller");
const hr_policies_service_1 = require("./services/hr-policies.service");
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
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: '3I3zCSdmG2Qt8X0lHvKkC5fsQp8Wfpx9MFdECFs9CS9Cu97GMrrpdptIxsP8sYPr',
                signOptions: { expiresIn: '24h' },
            }),
            consultation_module_1.ConsultationModule,
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                user_info_entity_1.UserInfo,
                user_location_permission_entity_1.UserLocationPermission,
                role_entity_1.Role,
                department_entity_1.Department,
                location_entity_1.Location,
                user_access_entity_1.UserAccess,
                module_entity_1.Module,
                sub_module_entity_1.SubModule,
                permission_entity_1.Permission,
                doctor_timeslot_entity_1.DoctorTimeslot,
                doctor_consultation_fee_entity_1.DoctorConsultationFee,
                attendance_entity_1.Attendance,
                system_setting_entity_1.SystemSetting,
                user_status_entity_1.UserStatus,
                blood_group_entity_1.BloodGroup,
                gender_entity_1.Gender,
                marital_status_entity_1.MaritalStatus,
                patient_entity_1.Patient,
                patient_source_entity_1.PatientSource,
                fee_masters_entity_1.FeeMasters,
                doctor_entity_1.Doctor,
                appointment_entity_1.Appointment,
                patient_examination_entity_1.PatientExamination,
                payment_installment_entity_1.PaymentInstallment,
                treatment_plan_month_entity_1.TreatmentPlanMonth,
                treatment_plan_entity_1.TreatmentPlan,
                call_history_entity_1.CallHistory,
                user_type_entity_1.UserType,
                appointment_type_entity_1.AppointmentType,
                mobile_number_entity_1.MobileNumber,
                mobile_number_next_call_entity_1.MobileNumberNextCall,
                payment_type_entity_1.PaymentType,
                expense_category_entity_1.ExpenseCategory,
                employee_expense_entity_1.EmployeeExpense,
                holiday_entity_1.Holiday,
                user_salary_details_entity_1.UserSalaryDetails,
                hr_policy_entity_1.HRPolicy,
            ]),
        ],
        controllers: [
            auth_controller_1.AuthController,
            users_controller_1.UsersController,
            roles_controller_1.RolesController,
            departments_controller_1.DepartmentsController,
            departments_public_controller_1.DepartmentsPublicController,
            locations_controller_1.LocationsController,
            locations_public_controller_1.LocationsPublicController,
            locations_management_controller_1.LocationsManagementController,
            permissions_controller_1.PermissionsController,
            modules_controller_1.ModulesController,
            test_controller_1.TestController,
            doctors_controller_1.DoctorsController,
            attendance_controller_1.AttendanceController,
            queue_controller_1.QueueController,
            profile_controller_1.ProfileController,
            system_settings_controller_1.SystemSettingsController,
            user_status_controller_1.UserStatusController,
            blood_group_controller_1.BloodGroupController,
            gender_controller_1.GenderController,
            marital_status_controller_1.MaritalStatusController,
            patient_registration_controller_1.PatientRegistrationController,
            patient_auth_controller_1.PatientAuthController,
            patient_appointments_controller_1.PatientAppointmentsController,
            patient_source_controller_1.PatientSourceController,
            fee_masters_controller_1.FeeMastersController,
            appointment_controller_1.AppointmentController,
            medical_history_controller_1.MedicalHistoryController,
            personal_history_controller_1.PersonalHistoryController,
            lifestyle_controller_1.LifestyleController,
            family_history_controller_1.FamilyHistoryController,
            drug_history_controller_1.DrugHistoryController,
            allergies_controller_1.AllergiesController,
            social_history_controller_1.SocialHistoryController,
            patient_examination_controller_1.PatientExaminationController,
            treatment_plan_month_controller_1.TreatmentPlanMonthController,
            treatment_plans_controller_1.TreatmentPlansController,
            prescription_controller_1.PrescriptionController,
            diet_chart_controller_1.DietChartController,
            telecaller_controller_1.TelecallerController,
            user_types_controller_1.UserTypesController,
            appointment_type_controller_1.AppointmentTypeController,
            mobile_call_controller_1.MobileCallController,
            mobile_numbers_controller_1.MobileNumbersController,
            mobile_assign_controller_1.MobileAssignController,
            mobile_call_tracking_controller_1.MobileCallTrackingController,
            call_history_controller_1.CallHistoryController,
            renewal_controller_1.RenewalController,
            presenting_complaints_controller_1.PresentingComplaintsController,
            payment_type_controller_1.PaymentTypeController,
            expense_categories_controller_1.ExpenseCategoriesController,
            employee_expenses_controller_1.EmployeeExpensesController,
            today_collections_controller_1.TodayCollectionsController,
            cash_collections_controller_1.CashCollectionsController,
            locationsip_controller_1.LocationsIpController,
            holidays_controller_1.HolidaysController,
            user_salary_controller_1.UserSalaryController,
            salary_calculation_controller_1.SalaryCalculationController,
            hr_policies_controller_1.HRPoliciesController,
        ],
        providers: [
            auth_service_1.AuthService,
            users_service_1.UsersService,
            roles_service_1.RolesService,
            departments_service_1.DepartmentsService,
            locations_service_1.LocationsService,
            permissions_service_1.PermissionsService,
            modules_service_1.ModulesService,
            doctors_service_1.DoctorsService,
            attendance_service_1.AttendanceService,
            queue_service_1.QueueService,
            jwt_strategy_1.JwtStrategy,
            profile_service_1.ProfileService,
            system_settings_service_1.SystemSettingsService,
            user_status_service_1.UserStatusService,
            user_location_service_1.UserLocationService,
            blood_group_service_1.BloodGroupService,
            gender_service_1.GenderService,
            marital_status_service_1.MaritalStatusService,
            patient_registration_service_1.PatientRegistrationService,
            patient_list_service_1.PatientListService,
            patient_source_service_1.PatientSourceService,
            fee_masters_service_1.FeeMastersService,
            appointment_service_1.AppointmentService,
            medical_history_service_1.MedicalHistoryService,
            personal_history_service_1.PersonalHistoryService,
            lifestyle_service_1.LifestyleService,
            family_history_service_1.FamilyHistoryService,
            drug_history_service_1.DrugHistoryService,
            allergies_service_1.AllergiesService,
            social_history_service_1.SocialHistoryService,
            patient_examination_service_1.PatientExaminationService,
            treatment_plan_month_service_1.TreatmentPlanMonthService,
            treatment_plans_service_1.TreatmentPlansService,
            prescription_service_1.PrescriptionService,
            diet_chart_service_1.DietChartService,
            telecaller_service_1.TelecallerService,
            user_types_service_1.UserTypesService,
            appointment_type_service_1.AppointmentTypeService,
            mobile_numbers_service_1.MobileNumbersService,
            mobile_assign_service_1.MobileAssignService,
            mobile_call_tracking_service_1.MobileCallTrackingService,
            call_history_service_1.CallHistoryService,
            renewal_service_1.RenewalService,
            presenting_complaints_service_1.PresentingComplaintsService,
            payment_type_service_1.PaymentTypeService,
            expense_categories_service_1.ExpenseCategoriesService,
            employee_expenses_service_1.EmployeeExpensesService,
            today_collections_service_1.TodayCollectionsService,
            cash_collections_service_1.CashCollectionsService,
            locationsip_service_1.LocationsIpService,
            holidays_service_1.HolidaysService,
            user_salary_service_1.UserSalaryService,
            salary_calculation_service_1.SalaryCalculationService,
            hr_policies_service_1.HRPoliciesService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map