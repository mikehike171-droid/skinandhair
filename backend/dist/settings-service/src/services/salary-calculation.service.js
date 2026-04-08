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
exports.SalaryCalculationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const user_salary_details_entity_1 = require("../entities/user-salary-details.entity");
const attendance_entity_1 = require("../entities/attendance.entity");
const holiday_entity_1 = require("../entities/holiday.entity");
let SalaryCalculationService = class SalaryCalculationService {
    constructor(userRepository, salaryRepository, attendanceRepository, holidayRepository) {
        this.userRepository = userRepository;
        this.salaryRepository = salaryRepository;
        this.attendanceRepository = attendanceRepository;
        this.holidayRepository = holidayRepository;
    }
    async calculateMonthlySalary(locationId, month, year) {
        const users = await this.userRepository.find({ where: { isActive: true } });
        const results = [];
        for (const user of users) {
            const salary = await this.calculateUserSalary(user.id, locationId, month, year);
            results.push(salary);
        }
        return results;
    }
    async calculateUserSalary(userId, locationId, month, year) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const salaryDetails = await this.salaryRepository.findOne({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
        if (!salaryDetails) {
            return {
                userId,
                userName: `${user.firstName} ${user.lastName}`,
                message: 'No salary details found'
            };
        }
        const monthlySalary = parseFloat(salaryDetails.salaryAmount.toString());
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const totalDaysInMonth = endDate.getDate();
        const dailySalary = monthlySalary / totalDaysInMonth;
        const holidays = await this.holidayRepository.find({
            where: {
                status: 'active'
            }
        });
        const holidayDates = holidays
            .filter(h => {
            const hDate = new Date(h.date);
            return hDate.getMonth() === month - 1 && hDate.getFullYear() === year;
        })
            .map(h => new Date(h.date).getDate());
        const attendance = await this.attendanceRepository
            .createQueryBuilder('attendance')
            .where('attendance.user_id = :userId', { userId })
            .andWhere('attendance.date >= :startDate', { startDate: startDate.toISOString().split('T')[0] })
            .andWhere('attendance.date <= :endDate', { endDate: endDate.toISOString().split('T')[0] })
            .orderBy('attendance.date', 'ASC')
            .getMany();
        console.log('Attendance records for user', userId, ':', attendance.map(a => ({
            date: a.date,
            status: a.status,
            leave_status: a.leave_status
        })));
        const REQUIRED_HOURS = 9;
        const LUNCH_BREAK = 1;
        const TEA_BREAK = 0.25;
        const GRACE_TIME = 0.25;
        const ACTUAL_WORKING_HOURS = REQUIRED_HOURS - LUNCH_BREAK - TEA_BREAK - GRACE_TIME;
        const MANDATORY_WEEKOFFS = 4;
        const USABLE_WEEKOFFS = 2;
        let totalWorkedHours = 0;
        let totalWorkedDays = 0;
        let approvedLeaveDays = 0;
        let pendingLeaveDays = 0;
        let absentDays = 0;
        let shortHours = 0;
        const attendanceByDate = {};
        attendance.forEach(record => {
            const dateKey = new Date(record.date).toISOString().split('T')[0];
            if (!attendanceByDate[dateKey]) {
                attendanceByDate[dateKey] = [];
            }
            attendanceByDate[dateKey].push(record);
        });
        for (let day = 1; day <= totalDaysInMonth; day++) {
            const currentDate = new Date(year, month - 1, day);
            const dateKey = currentDate.toISOString().split('T')[0];
            const dayRecords = attendanceByDate[dateKey] || [];
            if (holidayDates.includes(day)) {
                continue;
            }
            const leaveRecord = dayRecords.find(r => r.status?.toLowerCase().includes('leave') &&
                r.leave_status?.toLowerCase() === 'approved');
            if (leaveRecord) {
                approvedLeaveDays++;
                continue;
            }
            const pendingLeaveRecord = dayRecords.find(r => r.status?.toLowerCase().includes('leave') &&
                r.leave_status?.toLowerCase() === 'pending');
            if (pendingLeaveRecord) {
                pendingLeaveDays++;
                continue;
            }
            let dayWorkedMinutes = 0;
            dayRecords.forEach(record => {
                if (record.checkIn && record.checkOut) {
                    const [checkInHours, checkInMinutes, checkInSeconds] = record.checkIn.split(':').map(Number);
                    const [checkOutHours, checkOutMinutes, checkOutSeconds] = record.checkOut.split(':').map(Number);
                    const checkInTotalMinutes = checkInHours * 60 + checkInMinutes;
                    const checkOutTotalMinutes = checkOutHours * 60 + checkOutMinutes;
                    dayWorkedMinutes += (checkOutTotalMinutes - checkInTotalMinutes);
                }
                else if (record.duration) {
                    dayWorkedMinutes += parseInt(record.duration.toString());
                }
            });
            const dayWorkedHours = dayWorkedMinutes / 60;
            if (dayWorkedHours > 0) {
                totalWorkedHours += dayWorkedHours;
                if (dayWorkedHours >= ACTUAL_WORKING_HOURS) {
                    totalWorkedDays++;
                }
                else {
                    const dayShortHours = ACTUAL_WORKING_HOURS - dayWorkedHours;
                    shortHours += dayShortHours;
                }
            }
            else {
                absentDays++;
            }
        }
        const expectedWorkingDays = totalDaysInMonth - holidayDates.length - MANDATORY_WEEKOFFS;
        const extraDaysWorked = Math.max(0, totalWorkedDays - expectedWorkingDays);
        let salaryAddition = 0;
        let salaryDeduction = 0;
        salaryDeduction += absentDays * dailySalary;
        const shortDays = shortHours / ACTUAL_WORKING_HOURS;
        salaryDeduction += shortDays * dailySalary;
        salaryAddition += extraDaysWorked * dailySalary;
        const finalSalary = monthlySalary + salaryAddition - salaryDeduction;
        return {
            userId,
            userName: `${user.firstName} ${user.lastName}`,
            month,
            year,
            monthlySalary,
            dailySalary: parseFloat(dailySalary.toFixed(2)),
            totalDaysInMonth,
            expectedWorkingDays,
            totalWorkedDays,
            totalWorkedHours: parseFloat(totalWorkedHours.toFixed(2)),
            approvedLeaveDays,
            pendingLeaveDays,
            absentDays,
            holidayDays: holidayDates.length,
            shortHours: parseFloat(shortHours.toFixed(2)),
            extraDaysWorked,
            salaryAddition: parseFloat(salaryAddition.toFixed(2)),
            salaryDeduction: parseFloat(salaryDeduction.toFixed(2)),
            finalSalary: parseFloat(finalSalary.toFixed(2))
        };
    }
};
exports.SalaryCalculationService = SalaryCalculationService;
exports.SalaryCalculationService = SalaryCalculationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_salary_details_entity_1.UserSalaryDetails)),
    __param(2, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __param(3, (0, typeorm_1.InjectRepository)(holiday_entity_1.Holiday)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SalaryCalculationService);
//# sourceMappingURL=salary-calculation.service.js.map