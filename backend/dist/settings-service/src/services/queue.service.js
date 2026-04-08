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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const user_info_entity_1 = require("../entities/user-info.entity");
const department_entity_1 = require("../entities/department.entity");
const attendance_entity_1 = require("../entities/attendance.entity");
const user_location_permission_entity_1 = require("../entities/user-location-permission.entity");
const rxjs_1 = require("rxjs");
let QueueService = class QueueService {
    constructor(userRepository, userInfoRepository, departmentRepository, attendanceRepository, userLocationPermissionRepository, dataSource) {
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
        this.departmentRepository = departmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.userLocationPermissionRepository = userLocationPermissionRepository;
        this.dataSource = dataSource;
        this.queueUpdateSubject = new rxjs_1.Subject();
    }
    async getQueueAppointments(locationId) {
        try {
            const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
            const appointments = await this.dataSource.query(`
        SELECT 
          a.id,
          a.appointment_id,
          a.patient_id,
          a.doctor_id,
          a.appointment_date,
          a.appointment_time,
          a.appointment_type,
          a.appointment_type_id,
          a.status,
          a.notes,
          a.location_id,
          l.name as location_name,
          a.created_at,
          p.first_name as patient_first_name,
          p.last_name as patient_last_name,
          p.mobile as patient_phone,
          p.patient_id as patient_reg_id,
          d.first_name as doctor_first_name,
          d.last_name as doctor_last_name,
          at.name as appointment_type_name,
          at.code as appointment_type_code
        FROM appointments a
        LEFT JOIN patients p ON p.id = a.patient_id
        LEFT JOIN users d ON d.id = a.doctor_id
        LEFT JOIN appointment_types at ON at.id = a.appointment_type_id
        LEFT JOIN locations l ON l.id = a.location_id
        WHERE a.location_id = $1
          AND a.appointment_date = $2
        ORDER BY a.doctor_id, a.appointment_time ASC, a.created_at ASC
      `, [locationId, today]);
            const doctorMap = {};
            appointments.forEach((apt) => {
                const doctorKey = apt.doctor_id;
                const doctorName = `${apt.doctor_first_name || ''} ${apt.doctor_last_name || ''}`.trim();
                if (!doctorMap[doctorKey]) {
                    doctorMap[doctorKey] = {
                        doctorId: apt.doctor_id,
                        doctorName: doctorName,
                        locationId: apt.location_id,
                        locationName: apt.location_name,
                        patients: [],
                    };
                }
                doctorMap[doctorKey].patients.push({
                    id: apt.id,
                    appointmentId: apt.appointment_id,
                    patientId: apt.patient_id,
                    patientRegId: apt.patient_reg_id,
                    patientName: `${apt.patient_first_name || ''} ${apt.patient_last_name || ''}`.trim(),
                    patientPhone: apt.patient_phone,
                    appointmentTime: apt.appointment_time,
                    appointmentType: apt.appointment_type_code || apt.appointment_type,
                    typeName: apt.appointment_type_name,
                    status: apt.status,
                    notes: apt.notes,
                    queuePosition: doctorMap[doctorKey].patients.length + 1,
                });
            });
            const doctors = Object.values(doctorMap).map((doc) => {
                const currentPatient = doc.patients.find((p) => ['with_doctor', 'in_progress'].includes((p.status || '').toLowerCase()));
                const waitingPatients = doc.patients.filter((p) => ['waiting', 'pending', 'confirmed', 'scheduled'].includes((p.status || '').toLowerCase()));
                const completedPatients = doc.patients.filter((p) => ['completed', 'done', 'checked_out'].includes((p.status || '').toLowerCase()));
                return {
                    ...doc,
                    currentPatient: currentPatient || null,
                    waitingCount: waitingPatients.length,
                    completedCount: completedPatients.length,
                    totalCount: doc.patients.length,
                };
            });
            return {
                doctors,
                locationId,
                date: today,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            console.error('Error in getQueueAppointments:', error);
            return { doctors: [], locationId, date: new Date().toISOString().split('T')[0], timestamp: new Date().toISOString() };
        }
    }
    async updateAppointmentStatus(appointmentId, status) {
        try {
            await this.dataSource.query(`UPDATE appointments SET status = $1 WHERE appointment_id = $2`, [status, appointmentId]);
            const appointmentLocations = await this.dataSource.query(`SELECT a.location_id FROM appointments a
         WHERE a.appointment_id = $1`, [appointmentId]);
            if (appointmentLocations.length > 0) {
                this.queueUpdateSubject.next({ locationId: appointmentLocations[0].location_id });
            }
            return { message: 'Status updated', appointmentId, status };
        }
        catch (error) {
            console.error('Error updating appointment status:', error);
            throw error;
        }
    }
    async getDoctorsByDepartment(locationId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const departments = await this.departmentRepository.find({
                where: { locationId, isActive: true }
            });
            const result = {};
            for (const department of departments) {
                const doctorUsers = await this.userRepository
                    .createQueryBuilder('user')
                    .leftJoinAndSelect('user.userInfo', 'userInfo')
                    .leftJoin('user_location_permissions', 'ulp', 'ulp.user_id = user.id')
                    .select([
                    'user.id',
                    'user.firstName',
                    'user.lastName',
                    'user.working_days',
                    'user.working_hours',
                    'userInfo.userType'
                ])
                    .where('userInfo.userType = :userType', { userType: 'doctor' })
                    .andWhere('ulp.department_id = :departmentId', { departmentId: department.id })
                    .andWhere('ulp.location_id = :locationId', { locationId })
                    .andWhere('ulp.is_active = true')
                    .andWhere('user.isActive = true')
                    .getMany();
                const doctors = [];
                for (const user of doctorUsers) {
                    const latestAttendance = await this.attendanceRepository.query(`SELECT a.*, us.name as status_name, us.color_code 
           FROM attendance a 
           LEFT JOIN user_status us ON a.user_status_id = us.id 
           WHERE a.user_id = $1 AND a.date = $2 AND a.location_id = $3 
           ORDER BY a.id DESC LIMIT 1`, [user.id, today, locationId]);
                    doctors.push({
                        user_id: user.id,
                        user_firstName: user.firstName,
                        user_lastName: user.lastName,
                        working_days: user.workingDays,
                        working_hours: user.workingHours,
                        userInfo_userType: user.userInfo?.userType,
                        attendance_availableStatus: latestAttendance[0]?.status_name,
                        attendance_checkIn: latestAttendance[0]?.check_in,
                        attendance_checkOut: latestAttendance[0]?.check_out,
                        attendance_status: latestAttendance[0]?.status
                    });
                }
                if (doctors.length > 0) {
                    const transformedDoctors = doctors.map(doctor => {
                        let availabilityStatus = 'Not Available';
                        if (doctor.attendance_status === 'Present') {
                            if (doctor.attendance_checkOut) {
                                availabilityStatus = 'Not Available';
                            }
                            else {
                                availabilityStatus = doctor.attendance_availableStatus || 'Available';
                            }
                        }
                        else {
                            availabilityStatus = doctor.attendance_availableStatus || 'Not Available';
                        }
                        return {
                            id: doctor.user_id,
                            name: `${doctor.user_firstName} ${doctor.user_lastName}`,
                            status: availabilityStatus,
                            consultingRoom: `Room ${department.name.substring(0, 3).toUpperCase()}${doctor.user_id}`,
                            currentPatient: null,
                            isCheckedIn: doctor.attendance_status === 'Present' && !doctor.attendance_checkOut,
                            checkInTime: doctor.attendance_checkIn || null,
                            working_days: doctor.working_days,
                            working_hours: doctor.working_hours,
                        };
                    });
                    const deptKey = department.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                    result[deptKey] = transformedDoctors;
                }
            }
            return {
                doctorsByDepartment: result
            };
        }
        catch (error) {
            console.error('Error in getDoctorsByDepartment:', error);
            throw error;
        }
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_info_entity_1.UserInfo)),
    __param(2, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(3, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(4, (0, typeorm_1.InjectRepository)(user_location_permission_entity_1.UserLocationPermission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], QueueService);
//# sourceMappingURL=queue.service.js.map