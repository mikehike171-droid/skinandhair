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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_entity_1 = require("../entities/attendance.entity");
let AttendanceService = class AttendanceService {
    constructor(attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }
    async checkInOut(checkInOutDto) {
        const { userId, locationId, type } = checkInOutDto;
        const today = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toTimeString().split(' ')[0];
        let attendance = await this.attendanceRepository.findOne({
            where: { userId, locationId, date: today },
            order: { createdAt: 'DESC' },
            select: ['id', 'userId', 'locationId', 'date', 'checkIn', 'checkOut', 'duration', 'status', 'remarks', 'leave_type', 'leave_status', 'userStatusId', 'createdAt', 'updatedAt']
        });
        if (type === 'check-in') {
            let defaultStatusId = 1;
            try {
                const availableStatus = await this.attendanceRepository.query('SELECT id FROM user_status WHERE name = $1 AND status = true LIMIT 1', ['Available']);
                defaultStatusId = availableStatus[0]?.id || 1;
            }
            catch (error) {
                console.error('Error fetching user status:', error);
            }
            attendance = this.attendanceRepository.create({
                userId,
                locationId,
                date: today,
                checkIn: currentTime,
                status: 'Present',
                userStatusId: defaultStatusId
            });
        }
        else {
            if (!attendance) {
                throw new common_1.BadRequestException('No check-in record found for today');
            }
            if (attendance.checkOut !== null) {
                throw new common_1.BadRequestException('Already checked out');
            }
            attendance.checkOut = currentTime;
            attendance.duration = this.calculateDuration(attendance.checkIn, currentTime);
        }
        return await this.attendanceRepository.save(attendance);
    }
    async create(createAttendanceDto) {
        const attendance = this.attendanceRepository.create(createAttendanceDto);
        if (attendance.checkIn && attendance.checkOut) {
            attendance.duration = this.calculateDuration(attendance.checkIn, attendance.checkOut);
        }
        return await this.attendanceRepository.save(attendance);
    }
    async findAll(locationId, userId, date, page, limit) {
        const query = this.attendanceRepository.createQueryBuilder('attendance');
        if (locationId) {
            query.andWhere('attendance.locationId = :locationId', { locationId });
        }
        if (userId) {
            query.andWhere('attendance.userId = :userId', { userId });
        }
        if (date) {
            if (date.includes(',')) {
                const [fromDate, toDate] = date.split(',');
                query.andWhere('attendance.date >= :fromDate', { fromDate })
                    .andWhere('attendance.date <= :toDate', { toDate });
            }
            else {
                query.andWhere('attendance.date = :date', { date });
            }
        }
        query.orderBy('attendance.date', 'DESC').addOrderBy('attendance.createdAt', 'DESC');
        if (page && limit) {
            const skip = (page - 1) * limit;
            query.skip(skip).take(limit);
            const [data, totalRecords] = await query.getManyAndCount();
            const totalPages = Math.ceil(totalRecords / limit);
            return {
                data,
                totalRecords,
                totalPages,
                currentPage: page
            };
        }
        return await query.getMany();
    }
    async findOne(id) {
        const attendance = await this.attendanceRepository.findOne({
            where: { id },
            relations: ['user'],
            select: {
                user: {
                    username: true,
                    firstName: true,
                    lastName: true
                }
            }
        });
        if (!attendance) {
            throw new common_1.NotFoundException('Attendance record not found');
        }
        return attendance;
    }
    async update(id, updateAttendanceDto) {
        const attendance = await this.findOne(id);
        Object.assign(attendance, updateAttendanceDto);
        if (attendance.checkIn && attendance.checkOut) {
            attendance.duration = this.calculateDuration(attendance.checkIn, attendance.checkOut);
        }
        return await this.attendanceRepository.save(attendance);
    }
    async remove(id) {
        const attendance = await this.findOne(id);
        await this.attendanceRepository.remove(attendance);
    }
    async getUserTodayAttendance(userId, locationId) {
        const today = new Date().toISOString().split('T')[0];
        return await this.attendanceRepository.find({
            where: { userId, locationId, date: today },
            order: { createdAt: 'ASC' }
        });
    }
    async getAttendanceByDate(userId, locationId, date) {
        const result = await this.attendanceRepository.query(`SELECT a.*, us.name as "statusName", us.color_code as "statusColor" 
       FROM attendance a 
       LEFT JOIN user_status us ON a.user_status_id = us.id 
       WHERE a.user_id = $1 AND a.location_id = $2 AND a.date = $3 
       ORDER BY a.created_at ASC`, [userId, locationId, date]);
        return result;
    }
    async getGroupedAttendance(userId, locationId) {
        const query = `
      SELECT date::text as date, SUM(duration) as sum, 
             CASE 
               WHEN status = 'Leave' AND leave_status IS NOT NULL THEN CONCAT(status, '(', leave_status, ')')
               ELSE status 
             END as status
      FROM attendance 
      WHERE location_id = $1 AND user_id = $2
      GROUP BY date, status, leave_status
      ORDER BY date::date DESC
    `;
        const result = await this.attendanceRepository.query(query, [locationId, userId]);
        return result;
    }
    async getGroupedAttendancePaginated(userId, locationId, page, limit) {
        const offset = (page - 1) * limit;
        const query = `
      SELECT date::text as date, SUM(duration) as sum, 
             CASE 
               WHEN status = 'Leave' AND leave_status IS NOT NULL THEN CONCAT(status, '(', leave_status, ')')
               ELSE status 
             END as status
      FROM attendance 
      WHERE location_id = $1 AND user_id = $2
      GROUP BY date, status, leave_status
      ORDER BY date::date DESC
      LIMIT $3 OFFSET $4
    `;
        const countQuery = `
      SELECT COUNT(DISTINCT date) as total
      FROM attendance 
      WHERE location_id = $1 AND user_id = $2
    `;
        const [data, countResult] = await Promise.all([
            this.attendanceRepository.query(query, [locationId, userId, limit, offset]),
            this.attendanceRepository.query(countQuery, [locationId, userId])
        ]);
        const totalRecords = parseInt(countResult[0]?.total || '0');
        const totalPages = Math.ceil(totalRecords / limit);
        return {
            data,
            totalRecords,
            totalPages,
            currentPage: page
        };
    }
    async updateAvailableStatus(userId, locationId, userStatusId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const currentTime = new Date().toTimeString().split(' ')[0];
            const statusResult = await this.attendanceRepository.query('SELECT name FROM user_status WHERE id = $1', [userStatusId]);
            const statusName = statusResult[0]?.name;
            const currentAttendance = await this.attendanceRepository.findOne({
                where: { userId, locationId, date: today, checkOut: null },
                order: { createdAt: 'DESC' }
            });
            if (!currentAttendance) {
                if (statusName !== 'Offline') {
                    const newAttendance = this.attendanceRepository.create({
                        userId,
                        locationId,
                        date: today,
                        checkIn: currentTime,
                        status: 'Present',
                        userStatusId
                    });
                    return await this.attendanceRepository.save(newAttendance);
                }
                else {
                    throw new common_1.NotFoundException('No active attendance record found');
                }
            }
            if (currentAttendance.userStatusId === userStatusId) {
                return currentAttendance;
            }
            if (statusName === 'Offline') {
                currentAttendance.checkOut = currentTime;
                currentAttendance.duration = this.calculateDuration(currentAttendance.checkIn, currentTime);
                return await this.attendanceRepository.save(currentAttendance);
            }
            else {
                currentAttendance.userStatusId = userStatusId;
                return await this.attendanceRepository.save(currentAttendance);
            }
        }
        catch (error) {
            console.error('Error updating available status:', error);
            throw error;
        }
    }
    async getTotalDuration(userId, locationId, date) {
        const attendances = await this.attendanceRepository.find({
            where: { userId, locationId, date }
        });
        return attendances.reduce((total, attendance) => total + (attendance.duration || 0), 0);
    }
    async getAttendanceStats(userId, locationId) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const monthStart = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
        const today = now.toISOString().split('T')[0];
        const startOfWeek = new Date(now);
        const dayOfWeek = now.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        startOfWeek.setDate(now.getDate() + diff);
        const weekStart = startOfWeek.toISOString().split('T')[0];
        try {
            const thisMonthResult = await this.attendanceRepository
                .createQueryBuilder('attendance')
                .select('COUNT(DISTINCT attendance.date)', 'count')
                .where('attendance.userId = :userId', { userId })
                .andWhere('attendance.locationId = :locationId', { locationId })
                .andWhere('attendance.date >= :monthStart', { monthStart })
                .andWhere('attendance.date <= :today', { today })
                .andWhere('attendance.status = :status', { status: 'Present' })
                .getRawOne();
            const thisWeekResult = await this.attendanceRepository
                .createQueryBuilder('attendance')
                .select('COUNT(DISTINCT attendance.date)', 'count')
                .where('attendance.userId = :userId', { userId })
                .andWhere('attendance.locationId = :locationId', { locationId })
                .andWhere('attendance.date >= :weekStart', { weekStart })
                .andWhere('attendance.status = :status', { status: 'Present' })
                .getRawOne();
            const thisMonthAttendance = parseInt(thisMonthResult?.count || '0');
            const thisWeekAttendance = parseInt(thisWeekResult?.count || '0');
            const monthlyAttendances = await this.attendanceRepository
                .createQueryBuilder('attendance')
                .where('attendance.userId = :userId', { userId })
                .andWhere('attendance.locationId = :locationId', { locationId })
                .andWhere('attendance.date >= :monthStart', { monthStart })
                .andWhere('attendance.date <= :today', { today })
                .andWhere('attendance.duration > 0')
                .getMany();
            const totalMinutes = monthlyAttendances.reduce((sum, att) => sum + (att.duration || 0), 0);
            const avgHours = monthlyAttendances.length > 0 ? (totalMinutes / monthlyAttendances.length / 60).toFixed(1) : '0.0';
            const todayAttendances = await this.attendanceRepository
                .createQueryBuilder('attendance')
                .where('attendance.userId = :userId', { userId })
                .andWhere('attendance.locationId = :locationId', { locationId })
                .andWhere('attendance.date = :today', { today })
                .andWhere('attendance.duration > 0')
                .getMany();
            const todayTotalMinutes = todayAttendances.reduce((sum, att) => sum + (att.duration || 0), 0);
            const todayHours = (todayTotalMinutes / 60).toFixed(1);
            return {
                thisMonth: thisMonthAttendance,
                thisWeek: thisWeekAttendance,
                avgHours,
                todayHours
            };
        }
        catch (error) {
            console.error('Error calculating attendance stats:', error);
            return {
                thisMonth: 0,
                thisWeek: 0,
                avgHours: '0.0',
                todayHours: '0.0'
            };
        }
    }
    async getLeaveApplications(locationId, userId, page, limit, fromDate, toDate) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const query = this.attendanceRepository.createQueryBuilder('attendance')
                .leftJoin('attendance.user', 'user')
                .addSelect(['user.id', 'user.firstName', 'user.lastName', 'user.email'])
                .addSelect(['attendance.leave_status', 'attendance.leave_type'])
                .where('attendance.status = :status', { status: 'Leave' });
            if (fromDate && toDate) {
                query.andWhere('attendance.date >= :fromDate', { fromDate })
                    .andWhere('attendance.date <= :toDate', { toDate });
            }
            else {
                query.andWhere('attendance.date >= :today', { today });
            }
            if (locationId) {
                query.andWhere('attendance.locationId = :locationId', { locationId });
            }
            if (userId) {
                query.andWhere('attendance.userId = :userId', { userId });
            }
            query.orderBy('attendance.date', 'DESC');
            if (page && limit) {
                const skip = (page - 1) * limit;
                query.skip(skip).take(limit);
                const [data, totalRecords] = await query.getManyAndCount();
                const totalPages = Math.ceil(totalRecords / limit);
                return {
                    data,
                    totalRecords,
                    totalPages,
                    currentPage: page
                };
            }
            return await query.getMany();
        }
        catch (error) {
            console.error('Error fetching leave applications:', error);
            return [];
        }
    }
    async getAttendanceReport(locationId, fromMonth, toMonth, departmentId, userId, page = 1, limit = 10) {
        try {
            const currentDate = new Date();
            const defaultMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
            let startDate;
            let endDate;
            if (fromMonth && toMonth) {
                const [fromYear, fromMonthNum] = fromMonth.split('-').map(Number);
                const [toYear, toMonthNum] = toMonth.split('-').map(Number);
                startDate = `${fromYear}-${fromMonthNum.toString().padStart(2, '0')}-01`;
                endDate = new Date(toYear, toMonthNum, 0).toISOString().split('T')[0];
            }
            else {
                const targetMonth = fromMonth || defaultMonth;
                const [year, monthNum] = targetMonth.split('-').map(Number);
                startDate = `${year}-${monthNum.toString().padStart(2, '0')}-01`;
                endDate = new Date(year, monthNum, 0).toISOString().split('T')[0];
            }
            let query = `
        SELECT
          a.user_id as "userId",
          COALESCE(u.first_name || ' ' || u.last_name, 'User ' || a.user_id) as "userName",
          COUNT(DISTINCT CASE WHEN a.status = 'Present' THEN a.date END) as "attendanceDays",
          COUNT(DISTINCT CASE WHEN a.status LIKE '%Leave%' THEN a.date END) as "leaves"
        FROM attendance a
        LEFT JOIN users u ON a.user_id = u.id
        WHERE a.location_id = $1 AND a.date >= $2 AND a.date <= $3
      `;
            const params = [locationId, startDate, endDate];
            let paramIndex = 4;
            if (departmentId) {
                query += ` AND u."departmentId" = $${paramIndex}`;
                params.push(departmentId);
                paramIndex++;
            }
            if (userId) {
                query += ` AND a.user_id = $${paramIndex}`;
                params.push(userId);
            }
            query += `
        GROUP BY a.user_id, u.first_name, u.last_name
        ORDER BY a.user_id
        LIMIT ${limit} OFFSET ${(page - 1) * limit}
      `;
            let countQuery = `
        SELECT COUNT(DISTINCT a.user_id) as total
        FROM attendance a
        LEFT JOIN users u ON a.user_id = u.id
        WHERE a.location_id = $1 AND a.date >= $2 AND a.date <= $3
      `;
            const countParams = [locationId, startDate, endDate];
            let countParamIndex = 4;
            if (departmentId) {
                countQuery += ` AND u."departmentId" = $${countParamIndex}`;
                countParams.push(departmentId);
                countParamIndex++;
            }
            if (userId) {
                countQuery += ` AND a.user_id = $${countParamIndex}`;
                countParams.push(userId);
            }
            const [reportData, countResult] = await Promise.all([
                this.attendanceRepository.query(query, params),
                this.attendanceRepository.query(countQuery, countParams)
            ]);
            const totalRecords = parseInt(countResult[0]?.total || '0');
            const totalPages = Math.ceil(totalRecords / limit);
            return {
                data: reportData,
                totalRecords,
                totalPages,
                currentPage: page,
                limit
            };
        }
        catch (error) {
            console.error('Error in getAttendanceReport:', error);
            return [];
        }
    }
    async getDetailedAttendanceReport(locationId, fromDate, toDate, departmentId, userId, page = 1, limit = 10) {
        try {
            let query = `
        SELECT
          a.user_id as "userId",
          COALESCE(u.first_name || ' ' || u.last_name, 'User ' || a.user_id) as "userName",
          a.date::text as date,
          MIN(a.check_in) as "checkIn",
          MAX(a.check_out) as "checkOut",
          FLOOR(SUM(a.duration) / 60) || 'h:' || LPAD((SUM(a.duration) % 60)::text, 2, '0') || 'm' as duration
        FROM attendance a
        LEFT JOIN users u ON u.id = a.user_id
        WHERE a.location_id = $1
      `;
            const params = [locationId];
            if (fromDate && toDate) {
                query += ` AND a.date >= $2 AND a.date <= $3`;
                params.push(fromDate, toDate);
            }
            else {
                const currentDate = new Date().toISOString().split('T')[0];
                query += ` AND a.date = $2`;
                params.push(currentDate);
            }
            if (userId) {
                query += ` AND a.user_id = $${params.length + 1}`;
                params.push(userId);
            }
            query += `
        GROUP BY a.date, a.user_id, u.first_name, u.last_name
        ORDER BY a.date DESC, a.user_id
        LIMIT ${limit} OFFSET ${(page - 1) * limit}
      `;
            const countQuery = `
        SELECT COUNT(DISTINCT a.date || '-' || a.user_id) as total
        FROM attendance a
        WHERE a.location_id = $1` +
                (fromDate && toDate ? ` AND a.date >= $2 AND a.date <= $3` : ` AND a.date = $2`) +
                (userId ? ` AND a.user_id = $${params.length}` : '');
            const [reportData, countResult] = await Promise.all([
                this.attendanceRepository.query(query, params),
                this.attendanceRepository.query(countQuery, params)
            ]);
            return {
                data: reportData,
                totalRecords: parseInt(countResult[0]?.total || '0'),
                totalPages: Math.ceil(parseInt(countResult[0]?.total || '0') / limit),
                currentPage: page,
                limit
            };
        }
        catch (error) {
            return { data: [], totalRecords: 0, totalPages: 0, currentPage: 1, limit: 10 };
        }
    }
    async searchDoctors(searchTerm, locationId) {
        try {
            const query = `
        SELECT 
          u.id,
          CONCAT(u.first_name, ' ', u.last_name) as name,
          'General' as department,
          COALESCE(us.name, 'Available') as status,
          a.check_in as "checkIn",
          CASE WHEN a.check_out IS NULL AND a.check_in IS NOT NULL THEN true ELSE false END as "isCheckedIn"
        FROM users u
        LEFT JOIN attendance a ON u.id = a.user_id AND a.date = CURRENT_DATE AND a.location_id = $1 AND a.check_out IS NULL
        LEFT JOIN user_status us ON a.user_status_id = us.id
        WHERE LOWER(CONCAT(u.first_name, ' ', u.last_name)) LIKE LOWER($2)
        ORDER BY u.first_name, u.last_name
      `;
            const searchPattern = `%${searchTerm}%`;
            const results = await this.attendanceRepository.query(query, [locationId, searchPattern]);
            return {
                success: true,
                data: results,
                count: results.length
            };
        }
        catch (error) {
            console.error('Search error:', error);
            throw error;
        }
    }
    calculateDuration(checkIn, checkOut) {
        const [inHour, inMin] = checkIn.split(':').map(Number);
        const [outHour, outMin] = checkOut.split(':').map(Number);
        const inMinutes = inHour * 60 + inMin;
        const outMinutes = outHour * 60 + outMin;
        return Math.max(0, outMinutes - inMinutes);
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map