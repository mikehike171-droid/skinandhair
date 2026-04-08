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
exports.PatientAppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("../entities/appointment.entity");
let PatientAppointmentsController = class PatientAppointmentsController {
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
    async getPatientAppointments(id) {
        const appointments = await this.appointmentRepository.query(`
      SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.notes,
        u.first_name as doctor_first_name,
        u.last_name as doctor_last_name,
        d.specialization
      FROM appointments a
      LEFT JOIN users u ON u.id = a.doctor_id
      LEFT JOIN doctors d ON d.id = a.doctor_id
      WHERE a.patient_id = $1
      ORDER BY a.appointment_date DESC
    `, [parseInt(id)]);
        return {
            success: true,
            appointments: appointments.map(apt => ({
                id: apt.id,
                doctorName: `Dr. ${apt.doctor_first_name || ''} ${apt.doctor_last_name || ''}`.trim(),
                specialty: apt.specialization,
                appointmentDate: apt.appointment_date,
                appointmentTime: apt.appointment_time,
                status: apt.status,
                notes: apt.notes
            }))
        };
    }
};
exports.PatientAppointmentsController = PatientAppointmentsController;
__decorate([
    (0, common_1.Get)(':id/appointments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientAppointmentsController.prototype, "getPatientAppointments", null);
exports.PatientAppointmentsController = PatientAppointmentsController = __decorate([
    (0, common_1.Controller)('patients'),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PatientAppointmentsController);
//# sourceMappingURL=patient-appointments.controller.js.map