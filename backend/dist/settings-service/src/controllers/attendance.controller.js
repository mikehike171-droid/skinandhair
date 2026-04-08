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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("../services/attendance.service");
const attendance_dto_1 = require("../dto/attendance.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async checkInOut(checkInOutDto) {
        return await this.attendanceService.checkInOut(checkInOutDto);
    }
    async create(createAttendanceDto) {
        return await this.attendanceService.create(createAttendanceDto);
    }
    async findAll(locationId, userId, date, page, limit) {
        return await this.attendanceService.findAll(locationId, userId, date, page, limit);
    }
    async getUserTodayAttendance(userId, locationId) {
        return await this.attendanceService.getUserTodayAttendance(userId, locationId);
    }
    async getAttendanceByDate(userId, date, locationId) {
        return await this.attendanceService.getAttendanceByDate(userId, locationId, date);
    }
    async getGroupedAttendance(userId, locationId) {
        return await this.attendanceService.getGroupedAttendance(userId, locationId);
    }
    async getGroupedAttendancePaginated(userId, locationId, page = '1', limit = '10') {
        return await this.attendanceService.getGroupedAttendancePaginated(userId, locationId, parseInt(page), parseInt(limit));
    }
    async getTotalDuration(userId, locationId, date) {
        const duration = await this.attendanceService.getTotalDuration(userId, locationId, date);
        return { userId, locationId, date, totalDuration: duration };
    }
    async getAttendanceStats(userId, locationId) {
        return await this.attendanceService.getAttendanceStats(userId, locationId);
    }
    async updateAvailableStatus(updateStatusDto) {
        return await this.attendanceService.updateAvailableStatus(Number(updateStatusDto.userId), Number(updateStatusDto.locationId), updateStatusDto.userStatusId);
    }
    async getLeaveApplications(locationId, userId, page, limit, fromDate, toDate) {
        const locationIdNum = locationId ? parseInt(locationId) : undefined;
        const userIdNum = userId ? parseInt(userId) : undefined;
        const pageNum = page ? parseInt(page) : undefined;
        const limitNum = limit ? parseInt(limit) : undefined;
        return await this.attendanceService.getLeaveApplications(locationIdNum, userIdNum, pageNum, limitNum, fromDate, toDate);
    }
    async searchDoctors(searchTerm, locationId) {
        return await this.attendanceService.searchDoctors(searchTerm, locationId);
    }
    async findOne(id) {
        return await this.attendanceService.findOne(id);
    }
    async update(id, updateAttendanceDto) {
        return await this.attendanceService.update(id, updateAttendanceDto);
    }
    async remove(id) {
        await this.attendanceService.remove(id);
        return { message: 'Attendance record deleted successfully' };
    }
    async getAttendanceReport(body) {
        return await this.attendanceService.getAttendanceReport(body.locationId, body.fromMonth, body.toMonth, body.departmentId, body.userId, body.page || 1, body.limit || 10);
    }
    async getDetailedAttendanceReport(body) {
        return await this.attendanceService.getDetailedAttendanceReport(body.locationId, body.fromDate, body.toDate, body.departmentId, body.userId, body.page || 1, body.limit || 10);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('check-in-out'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.CheckInOutDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkInOut", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.CreateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('locationId')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId/today'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getUserTodayAttendance", null);
__decorate([
    (0, common_1.Get)('user/:userId/date/:date'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('date')),
    __param(2, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceByDate", null);
__decorate([
    (0, common_1.Get)('user/:userId/grouped'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getGroupedAttendance", null);
__decorate([
    (0, common_1.Get)('user/:userId/user-leaves'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('locationId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getGroupedAttendancePaginated", null);
__decorate([
    (0, common_1.Get)('user/:userId/duration'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('locationId')),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getTotalDuration", null);
__decorate([
    (0, common_1.Get)('user/:userId/stats'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceStats", null);
__decorate([
    (0, common_1.Patch)('available-status'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.UpdateAvailableStatusDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "updateAvailableStatus", null);
__decorate([
    (0, common_1.Get)('leaves'),
    __param(0, (0, common_1.Query)('locationId')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('fromDate')),
    __param(5, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getLeaveApplications", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('searchTerm')),
    __param(1, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "searchDoctors", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, attendance_dto_1.UpdateAttendanceDto]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('summary'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceReport", null);
__decorate([
    (0, common_1.Post)('report'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getDetailedAttendanceReport", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)('attendance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map