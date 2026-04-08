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
exports.AppointmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("../entities/appointment.entity");
const doctor_entity_1 = require("../entities/doctor.entity");
let AppointmentService = class AppointmentService {
    constructor(appointmentRepository, doctorRepository, dataSource) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.dataSource = dataSource;
    }
    async getAppointments(filters) {
        try {
            const { locationId, fromDate, toDate, status, search, doctorId } = filters;
            const params = [locationId];
            let paramIndex = 2;
            let whereClause = `WHERE a.location_id = $1`;
            if (fromDate) {
                whereClause += ` AND a.appointment_date >= $${paramIndex}`;
                params.push(fromDate);
                paramIndex++;
            }
            if (toDate) {
                whereClause += ` AND a.appointment_date <= $${paramIndex}`;
                params.push(toDate);
                paramIndex++;
            }
            if (status) {
                whereClause += ` AND a.status = $${paramIndex}`;
                params.push(status);
                paramIndex++;
            }
            if (doctorId && !isNaN(doctorId)) {
                whereClause += ` AND a.doctor_id = $${paramIndex}`;
                params.push(doctorId);
                paramIndex++;
            }
            if (search) {
                whereClause += ` AND (
          p.first_name ILIKE $${paramIndex} OR 
          p.last_name ILIKE $${paramIndex} OR 
          p.mobile ILIKE $${paramIndex} OR
          d.first_name ILIKE $${paramIndex} OR
          d.last_name ILIKE $${paramIndex}
        )`;
                params.push(`%${search}%`);
                paramIndex++;
            }
            const limit = isNaN(filters.limit) ? 50 : filters.limit;
            const page = isNaN(filters.page) ? 1 : filters.page;
            const offset = (page - 1) * limit;
            const appointments = await this.dataSource.query(`
        SELECT 
          a.appointment_id,
          a.patient_id,
          a.doctor_id,
          a.appointment_date,
          a.appointment_time,
          a.appointment_type,
          a.appointment_type_id,
          a.status,
          a.notes,
          a.created_at,
          a.created_by,
          p.first_name as patient_first_name,
          p.last_name as patient_last_name,
          p.mobile as patient_phone,
          d.first_name as doctor_first_name,
          d.last_name as doctor_last_name,
          c.first_name as creator_first_name,
          c.last_name as creator_last_name,
          at.name as appointment_type_name,
          at.code as appointment_type_code,
          ch.next_call_date
        FROM appointments a
        LEFT JOIN patients p ON p.id = a.patient_id
        LEFT JOIN users d ON d.id = a.doctor_id
        LEFT JOIN users c ON c.id = a.created_by
        LEFT JOIN appointment_types at ON at.id = a.appointment_type_id
        LEFT JOIN (
          SELECT DISTINCT ON (patient_id) 
            patient_id, 
            next_call_date
          FROM call_history 
          ORDER BY patient_id, next_call_date DESC
        ) ch ON ch.patient_id::text = a.patient_id::text
        ${whereClause}
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `, [...params, limit, offset]);
            const countResult = await this.dataSource.query(`
        SELECT COUNT(*) as total
        FROM appointments a
        LEFT JOIN patients p ON p.id = a.patient_id
        LEFT JOIN users d ON d.id = a.doctor_id
        ${whereClause}
      `, params);
            const total = parseInt(countResult[0].total);
            const limitVal = isNaN(filters.limit) ? 50 : filters.limit;
            const totalPages = Math.ceil(total / limitVal);
            const statsResult = await this.dataSource.query(`
        SELECT a.status, COUNT(*) as count
        FROM appointments a
        LEFT JOIN patients p ON p.id = a.patient_id
        LEFT JOIN users d ON d.id = a.doctor_id
        ${whereClause}
        GROUP BY a.status
      `, params);
            let waitingCount = 0;
            let withDoctorCount = 0;
            let completedCount = 0;
            statsResult.forEach(row => {
                const count = parseInt(row.count);
                const status = (row.status || '').toLowerCase();
                if (['waiting', 'scheduled', 'pending'].includes(status)) {
                    waitingCount += count;
                }
                else if (['with_doctor', 'in_progress'].includes(status)) {
                    withDoctorCount += count;
                }
                else if (['completed', 'done'].includes(status)) {
                    completedCount += count;
                }
            });
            return {
                data: appointments.map(appointment => ({
                    id: appointment.appointment_id,
                    patientId: appointment.patient_id,
                    patientName: `${appointment.patient_first_name || ''} ${appointment.patient_last_name || ''}`.trim() || `Patient #${appointment.patient_id}`,
                    patientPhone: appointment.patient_phone || 'N/A',
                    createdBy: `${appointment.creator_first_name || ''} ${appointment.creator_last_name || ''}`.trim() || 'System',
                    doctorId: appointment.doctor_id,
                    doctorName: `${appointment.doctor_first_name || ''} ${appointment.doctor_last_name || ''}`.trim() || `Doctor #${appointment.doctor_id}`,
                    appointmentDate: appointment.appointment_date,
                    appointmentTime: appointment.appointment_time,
                    type: appointment.appointment_type_code || appointment.appointment_type || 'consultation',
                    typeName: appointment.appointment_type_name || 'Consultation',
                    status: appointment.status || 'pending',
                    notes: appointment.notes,
                    createdAt: appointment.created_at,
                    nextCallDate: appointment.next_call_date
                })),
                total: total,
                page: filters.page,
                limit: filters.limit,
                totalPages: totalPages,
                stats: {
                    total: total,
                    waiting: waitingCount,
                    withDoctor: withDoctorCount,
                    completed: completedCount
                },
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('Error in getAppointments:', error);
            return {
                data: [],
                total: 0,
                page: 1,
                limit: 50,
                totalPages: 0
            };
        }
    }
    async getMyDoctorAppointments(doctorId, page = 1, limit = 50, fromDate, toDate) {
        try {
            const params = [doctorId];
            let paramIndex = 2;
            let whereClause = `WHERE a.doctor_id = $1`;
            if (fromDate) {
                whereClause += ` AND a.appointment_date >= $${paramIndex}`;
                params.push(fromDate);
                paramIndex++;
            }
            if (toDate) {
                whereClause += ` AND a.appointment_date <= $${paramIndex}`;
                params.push(toDate);
                paramIndex++;
            }
            const limitVal = isNaN(limit) ? 50 : limit;
            const pageVal = isNaN(page) ? 1 : page;
            const offset = (pageVal - 1) * limitVal;
            const appointments = await this.dataSource.query(`
        SELECT 
          a.appointment_id,
          a.patient_id,
          a.doctor_id,
          a.appointment_date,
          a.appointment_time,
          a.appointment_type,
          a.appointment_type_id,
          a.status,
          a.notes,
          a.created_at,
          a.created_by,
          p.first_name as patient_first_name,
          p.last_name as patient_last_name,
          p.mobile as patient_phone,
          d.first_name as doctor_first_name,
          d.last_name as doctor_last_name,
          c.first_name as creator_first_name,
          c.last_name as creator_last_name,
          at.name as appointment_type_name,
          at.code as appointment_type_code
        FROM appointments a
        LEFT JOIN patients p ON p.id = a.patient_id
        LEFT JOIN users d ON d.id = a.doctor_id
        LEFT JOIN users c ON c.id = a.created_by
        LEFT JOIN appointment_types at ON at.id = a.appointment_type_id
        ${whereClause}
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `, [...params, limitVal, offset]);
            const countResult = await this.dataSource.query(`
        SELECT COUNT(*) as total
        FROM appointments a
        ${whereClause}
      `, params);
            const total = parseInt(countResult[0].total);
            const totalPages = Math.ceil(total / limitVal);
            return {
                data: appointments.map(appointment => ({
                    id: appointment.appointment_id,
                    patientId: appointment.patient_id,
                    patientName: `${appointment.patient_first_name || ''} ${appointment.patient_last_name || ''}`.trim() || `Patient #${appointment.patient_id}`,
                    patientPhone: appointment.patient_phone || 'N/A',
                    createdBy: `${appointment.creator_first_name || ''} ${appointment.creator_last_name || ''}`.trim() || 'System',
                    doctorId: appointment.doctor_id,
                    doctorName: `${appointment.doctor_first_name || ''} ${appointment.doctor_last_name || ''}`.trim() || `Doctor #${appointment.doctor_id}`,
                    appointmentDate: appointment.appointment_date,
                    appointmentTime: appointment.appointment_time,
                    type: appointment.appointment_type_code || appointment.appointment_type || 'consultation',
                    typeName: appointment.appointment_type_name || 'Consultation',
                    status: appointment.status || 'pending',
                    notes: appointment.notes,
                    createdAt: appointment.created_at
                })),
                total,
                page,
                limit,
                totalPages,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('Error in getMyDoctorAppointments:', error);
            return {
                data: [],
                total: 0,
                page: 1,
                limit: 50,
                totalPages: 0
            };
        }
    }
    async getPatientAppointments(patientId, locationId) {
        const queryBuilder = this.appointmentRepository
            .createQueryBuilder('appointment')
            .where('appointment.patient_id = :patientId', { patientId });
        if (locationId) {
            queryBuilder.andWhere('appointment.location_id = :locationId', { locationId });
        }
        const appointments = await queryBuilder.getMany();
        return appointments.map(appointment => ({
            id: appointment.id,
            appointmentId: appointment.appointment_id,
            appointmentDate: appointment.appointment_date,
            appointmentTime: appointment.appointment_time,
            appointmentType: appointment.appointment_type,
            doctorName: `Doctor #${appointment.doctor_id}`,
            notes: appointment.notes,
            createdAt: appointment.created_at
        }));
    }
    async createAppointment(appointmentData, locationId) {
        const appointmentTypeResult = await this.dataSource.query('SELECT id FROM appointment_types WHERE code = $1 LIMIT 1', [appointmentData.appointmentType || 'consultation']);
        const appointmentTypeId = appointmentTypeResult.length > 0 ? appointmentTypeResult[0].id : 1;
        const appointment = this.appointmentRepository.create({
            appointment_id: `APT${Date.now()}`,
            patient_id: appointmentData.patientId,
            doctor_id: appointmentData.doctorId,
            appointment_date: appointmentData.appointmentDate,
            appointment_time: appointmentData.appointmentTime,
            appointment_type: appointmentData.appointmentType || 'consultation',
            appointment_type_id: appointmentTypeId,
            notes: appointmentData.notes,
            location_id: locationId,
        });
        const savedAppointment = await this.appointmentRepository.save(appointment);
        return {
            message: 'Appointment created successfully',
            appointment: {
                id: savedAppointment.id,
                appointmentId: savedAppointment.appointment_id
            }
        };
    }
    async updateNextCallDate(patientId, nextCallDate, userId, locationId) {
        try {
            await this.dataSource.query(`
        INSERT INTO call_history (patient_id, next_call_date, created_by, location_id, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `, [patientId, nextCallDate, userId, locationId]);
            return {
                message: 'Next call date updated successfully',
                patientId,
                nextCallDate
            };
        }
        catch (error) {
            console.error('Error updating next call date:', error);
            throw new Error('Failed to update next call date');
        }
    }
    async getAppointmentById(appointmentId) {
        try {
            const appointment = await this.dataSource.query(`
        SELECT 
          a.appointment_id,
          a.patient_id,
          a.doctor_id,
          a.appointment_date,
          a.appointment_time,
          a.appointment_type,
          a.status,
          a.notes,
          a.created_at,
          p.first_name as patient_first_name,
          p.last_name as patient_last_name,
          d.first_name as doctor_first_name,
          d.last_name as doctor_last_name
        FROM appointments a
        LEFT JOIN patients p ON p.id = a.patient_id
        LEFT JOIN users d ON d.id = a.doctor_id
        WHERE a.appointment_id = $1
      `, [appointmentId]);
            if (appointment.length === 0) {
                throw new Error('Appointment not found');
            }
            const apt = appointment[0];
            return {
                id: apt.appointment_id,
                patientId: apt.patient_id,
                doctorId: apt.doctor_id,
                appointmentDate: apt.appointment_date,
                appointmentTime: apt.appointment_time,
                type: apt.appointment_type,
                status: apt.status,
                notes: apt.notes,
                patientName: `${apt.patient_first_name || ''} ${apt.patient_last_name || ''}`.trim(),
                doctorName: `${apt.doctor_first_name || ''} ${apt.doctor_last_name || ''}`.trim()
            };
        }
        catch (error) {
            console.error('Error fetching appointment:', error);
            throw new Error('Failed to fetch appointment');
        }
    }
    async updateAppointment(appointmentId, updateData) {
        try {
            const appointmentTypeResult = await this.dataSource.query('SELECT id FROM appointment_types WHERE code = $1 LIMIT 1', [updateData.appointmentType || 'consultation']);
            const appointmentTypeId = appointmentTypeResult.length > 0 ? appointmentTypeResult[0].id : 1;
            const result = await this.dataSource.query(`
        UPDATE appointments 
        SET 
          doctor_id = $1,
          appointment_date = $2,
          appointment_time = $3,
          appointment_type = $4,
          appointment_type_id = $5,
          status = $6,
          notes = $7
        WHERE appointment_id = $8
      `, [
                updateData.doctorId,
                updateData.appointmentDate,
                updateData.appointmentTime,
                updateData.appointmentType,
                appointmentTypeId,
                updateData.status,
                updateData.notes,
                appointmentId
            ]);
            if (result.rowCount === 0) {
                const existing = await this.dataSource.query('SELECT * FROM appointments WHERE appointment_id = $1 OR id = $1', [appointmentId]);
                if (existing.length === 0) {
                    throw new Error('Appointment not found');
                }
                throw new Error('Update failed - no rows affected');
            }
            return {
                message: 'Appointment updated successfully',
                appointmentId
            };
        }
        catch (error) {
            console.error('Error updating appointment:', error);
            throw new Error('Failed to update appointment');
        }
    }
    async getDoctorAppointmentsWithUserDetails(doctorId, page = 1, limit = 50, fromDate, toDate) {
        try {
            let query = `
        SELECT 
          a.id,
          a.appointment_id,
          a.patient_id,
          a.doctor_id,
          a.appointment_date,
          a.appointment_time,
          a.appointment_type,
          a.status,
          a.notes,
          a.created_at,
          p.first_name as patient_first_name,
          p.last_name as patient_last_name,
          p.mobile as patient_phone,
          u.first_name as doctor_first_name,
          u.last_name as doctor_last_name,
          u.email as doctor_email,
          u.phone as doctor_phone
        FROM appointments a
        LEFT JOIN patients p ON p.id = a.patient_id
        LEFT JOIN users u ON u.id = a.doctor_id
        WHERE a.doctor_id = $1`;
            const params = [doctorId];
            let paramIndex = 2;
            if (fromDate) {
                query += ` AND a.appointment_date >= $${paramIndex}`;
                params.push(fromDate);
                paramIndex++;
            }
            if (toDate) {
                query += ` AND a.appointment_date <= $${paramIndex}`;
                params.push(toDate);
                paramIndex++;
            }
            const limitVal = isNaN(limit) ? 50 : limit;
            const pageVal = isNaN(page) ? 1 : page;
            const offset = (pageVal - 1) * limitVal;
            query += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
            params.push(limitVal, offset);
            const appointments = await this.dataSource.query(query, params);
            let countQuery = `SELECT COUNT(*) as total FROM appointments a WHERE a.doctor_id = $1`;
            const countParams = [doctorId];
            let countParamIndex = 2;
            if (fromDate) {
                countQuery += ` AND a.appointment_date >= $${countParamIndex}`;
                countParams.push(fromDate);
                countParamIndex++;
            }
            if (toDate) {
                countQuery += ` AND a.appointment_date <= $${countParamIndex}`;
                countParams.push(toDate);
            }
            const countResult = await this.dataSource.query(countQuery, countParams);
            const total = parseInt(countResult[0].total);
            const totalPages = Math.ceil(total / limit);
            return {
                data: appointments.map(apt => ({
                    id: apt.appointment_id,
                    patientId: apt.patient_id,
                    patientName: `${apt.patient_first_name || ''} ${apt.patient_last_name || ''}`.trim() || `Patient #${apt.patient_id}`,
                    patientPhone: apt.patient_phone || 'N/A',
                    doctorId: apt.doctor_id,
                    doctorName: `${apt.doctor_first_name || ''} ${apt.doctor_last_name || ''}`.trim(),
                    doctorEmail: apt.doctor_email,
                    doctorPhone: apt.doctor_phone,
                    appointmentDate: apt.appointment_date,
                    appointmentTime: apt.appointment_time,
                    type: apt.appointment_type,
                    status: apt.status || 'scheduled',
                    notes: apt.notes,
                    createdAt: apt.created_at
                })),
                total,
                page: pageVal,
                limit: limitVal,
                totalPages: Math.ceil(total / limitVal)
            };
        }
        catch (error) {
            console.error('Error fetching doctor appointments:', error);
            return {
                data: [],
                total: 0,
                page: 1,
                limit: 50,
                totalPages: 0
            };
        }
    }
};
exports.AppointmentService = AppointmentService;
exports.AppointmentService = AppointmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __param(1, (0, typeorm_1.InjectRepository)(doctor_entity_1.Doctor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], AppointmentService);
//# sourceMappingURL=appointment.service.js.map