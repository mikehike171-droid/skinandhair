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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const user_info_entity_1 = require("../entities/user-info.entity");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    constructor(userRepository, userInfoRepository) {
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
    }
    async findAll(locationId, page = 1, limit = 10, departmentId) {
        try {
            const offset = (page - 1) * limit;
            let whereConditions = '1=1';
            let queryParams = [];
            let paramIndex = 1;
            if (locationId) {
                whereConditions += ` AND ulp.location_id = $${paramIndex}`;
                queryParams.push(locationId);
                paramIndex++;
            }
            if (departmentId) {
                whereConditions += ` AND ulp.department_id = $${paramIndex}`;
                queryParams.push(departmentId);
                paramIndex++;
            }
            const countQuery = `
        SELECT COUNT(DISTINCT u.id) as total
        FROM users u
        LEFT JOIN user_location_permissions ulp ON u.id = ulp.user_id
        WHERE ${whereConditions}
      `;
            const query = `
        SELECT DISTINCT u.id, u.username, u.first_name as "firstName", u.last_name as "lastName", 
               u.email, u.phone, u.primary_location_id as "primaryLocationId", 
               u.is_active as "isActive", u.created_at as "createdAt", u.updated_at as "updatedAt",
               ulp.role_id as "roleId", ulp.department_id as "departmentId",
               r.name as "role_name", d.name as "departmentName"
        FROM users u
        LEFT JOIN user_location_permissions ulp ON u.id = ulp.user_id
        LEFT JOIN roles r ON ulp.role_id = r.id
        LEFT JOIN departments d ON ulp.department_id = d.id
        WHERE ${whereConditions}
        ORDER BY u.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
            const [countResult, rawUsers] = await Promise.all([
                this.userRepository.query(countQuery, queryParams),
                this.userRepository.query(query, [...queryParams, limit, offset])
            ]);
            const total = parseInt(countResult[0].total);
            const totalPages = Math.ceil(total / limit);
            const usersWithLocationNames = await Promise.all(rawUsers.map(async (user) => {
                const locationQuery = `
            SELECT l.name 
            FROM user_location_permissions ulp
            JOIN locations l ON ulp.location_id = l.id
            WHERE ulp.user_id = $1
          `;
                const locations = await this.userRepository.query(locationQuery, [user.id]);
                const locationNames = locations.map(loc => loc.name).join(', ');
                const locationIds = locations.map(loc => loc.id).join(',');
                return {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    roleId: user.roleId,
                    locationId: locationIds,
                    departmentId: user.departmentId,
                    departmentName: user.departmentName,
                    locationNames: locationNames,
                    primaryLocationId: user.primaryLocationId,
                    isActive: user.isActive,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    roleName: user.role_name
                };
            }));
            return {
                users: usersWithLocationNames,
                total,
                totalPages
            };
        }
        catch (error) {
            console.error('Error in findAll users:', error);
            const users = await this.userRepository.find({
                order: { createdAt: 'DESC' },
            });
            return {
                users,
                total: users.length,
                totalPages: Math.ceil(users.length / limit)
            };
        }
    }
    async findOne(id) {
        const query = `
      SELECT u.*, ui.user_type, ui.alternate_phone, ui.address, ui.pincode,
             ui.qualification, ui.years_of_experience, ui.medical_registration_number,
             ui.registration_council, ui.registration_valid_until, ui.license_copy,
             ui.degree_certificates, ui.employment_type, ui.joining_date
      FROM users u
      LEFT JOIN user_info ui ON u.user_info_id = ui.id
      WHERE u.id = $1
    `;
        const result = await this.userRepository.query(query, [id]);
        if (!result || result.length === 0) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const user = result[0];
        const permissionsQuery = `
      SELECT ulp.role_id, ulp.department_id, ulp.location_id
      FROM user_location_permissions ulp
      WHERE ulp.user_id = $1
      LIMIT 1
    `;
        const permissions = await this.userRepository.query(permissionsQuery, [id]);
        const userPermission = permissions.length > 0 ? permissions[0] : null;
        const locationQuery = `
      SELECT location_id FROM user_location_permissions WHERE user_id = $1
    `;
        const locations = await this.userRepository.query(locationQuery, [id]);
        const locationIds = locations.map(loc => loc.location_id).join(',');
        return {
            id: user.id,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone,
            roleId: userPermission?.role_id || null,
            departmentId: userPermission?.department_id || null,
            locationId: locationIds,
            primaryLocationId: user.primary_location_id,
            userInfoId: user.user_info_id,
            isActive: user.is_active,
            userType: user.user_type,
            alternatePhone: user.alternate_phone,
            address: user.address,
            pincode: user.pincode,
            qualification: user.qualification,
            yearsOfExperience: user.years_of_experience,
            medicalRegistrationNumber: user.medical_registration_number,
            registrationCouncil: user.registration_council,
            registrationValidUntil: user.registration_valid_until ? `${user.registration_valid_until.getFullYear()}-${String(user.registration_valid_until.getMonth() + 1).padStart(2, '0')}-${String(user.registration_valid_until.getDate()).padStart(2, '0')}` : null,
            licenseCopy: user.license_copy,
            degreeCertificates: user.degree_certificates,
            employmentType: user.employment_type,
            joiningDate: user.joining_date ? `${user.joining_date.getFullYear()}-${String(user.joining_date.getMonth() + 1).padStart(2, '0')}-${String(user.joining_date.getDate()).padStart(2, '0')}` : null,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        };
    }
    async create(userData) {
        const existingUsername = await this.userRepository.findOne({
            where: { username: userData.username },
        });
        if (existingUsername) {
            throw new common_1.ConflictException('Username already exists');
        }
        if (userData.email && userData.email.trim() !== '') {
            const existingEmail = await this.userRepository.findOne({
                where: { email: userData.email },
            });
            if (existingEmail) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        const userInfo = this.userInfoRepository.create({
            userType: userData.userType || 'staff',
            alternatePhone: userData.alternatePhone,
            address: userData.address,
            pincode: userData.pincode,
            qualification: userData.qualification,
            yearsOfExperience: userData.yearsOfExperience,
            medicalRegistrationNumber: userData.medicalRegistrationNumber,
            registrationCouncil: userData.registrationCouncil,
            registrationValidUntil: userData.registrationValidUntil,
            licenseCopy: userData.licenseCopy,
            degreeCertificates: userData.degreeCertificates,
            employmentType: userData.employmentType,
            joiningDate: userData.joiningDate,
        });
        const savedUserInfo = await this.userInfoRepository.save(userInfo);
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            password: hashedPassword,
            primaryLocationId: userData.primaryLocationId || userData.locationId,
            isActive: userData.isActive,
            userInfoId: savedUserInfo.id,
        });
        const savedUser = await this.userRepository.save(user);
        if (userData.roleId && userData.locationId) {
            const locationIds = Array.isArray(userData.locationId) ? userData.locationId : userData.locationId.split(',');
            for (const locationId of locationIds) {
                await this.userRepository.query('INSERT INTO user_location_permissions (user_id, role_id, department_id, location_id) VALUES ($1, $2, $3, $4)', [savedUser.id, userData.roleId, userData.departmentId, parseInt(locationId.toString().trim())]);
            }
        }
        return savedUser;
    }
    async update(id, userData) {
        try {
            const user = await this.findOne(id);
            if (user.userInfoId) {
                const userInfoData = {};
                if (userData.userType !== undefined)
                    userInfoData.userType = userData.userType;
                if (userData.alternatePhone !== undefined)
                    userInfoData.alternatePhone = userData.alternatePhone;
                if (userData.address !== undefined)
                    userInfoData.address = userData.address;
                if (userData.pincode !== undefined)
                    userInfoData.pincode = userData.pincode;
                if (userData.qualification !== undefined)
                    userInfoData.qualification = userData.qualification;
                if (userData.yearsOfExperience !== undefined)
                    userInfoData.yearsOfExperience = userData.yearsOfExperience;
                if (userData.medicalRegistrationNumber !== undefined)
                    userInfoData.medicalRegistrationNumber = userData.medicalRegistrationNumber;
                if (userData.registrationCouncil !== undefined)
                    userInfoData.registrationCouncil = userData.registrationCouncil;
                if (userData.registrationValidUntil !== undefined)
                    userInfoData.registrationValidUntil = userData.registrationValidUntil;
                if (userData.licenseCopy !== undefined)
                    userInfoData.licenseCopy = userData.licenseCopy;
                if (userData.degreeCertificates !== undefined)
                    userInfoData.degreeCertificates = userData.degreeCertificates;
                if (userData.employmentType !== undefined)
                    userInfoData.employmentType = userData.employmentType;
                if (userData.joiningDate !== undefined)
                    userInfoData.joiningDate = userData.joiningDate;
                if (Object.keys(userInfoData).length > 0) {
                    await this.userInfoRepository.update(user.userInfoId, userInfoData);
                }
            }
            const cleanData = {};
            if (userData.username)
                cleanData.username = userData.username;
            if (userData.firstName)
                cleanData.first_name = userData.firstName;
            if (userData.lastName)
                cleanData.last_name = userData.lastName;
            if (userData.email)
                cleanData.email = userData.email;
            if (userData.phone !== undefined)
                cleanData.phone = userData.phone;
            if (userData.primaryLocationId !== undefined)
                cleanData.primary_location_id = userData.primaryLocationId;
            if (userData.isActive !== undefined)
                cleanData.is_active = userData.isActive;
            if (userData.password) {
                cleanData.password = await bcrypt.hash(userData.password, 10);
            }
            if (Object.keys(cleanData).length > 0) {
                await this.userRepository.query(`UPDATE users SET ${Object.keys(cleanData).map((key, index) => `${key} = $${index + 2}`).join(', ')}, updated_at = NOW() WHERE id = $1`, [id, ...Object.values(cleanData)]);
            }
            if (userData.roleId !== undefined || userData.departmentId !== undefined || userData.locationId !== undefined) {
                await this.userRepository.query('DELETE FROM user_location_permissions WHERE user_id = $1', [id]);
                if (userData.roleId && userData.locationId) {
                    const locationIds = Array.isArray(userData.locationId) ? userData.locationId : userData.locationId.split(',');
                    for (const locationId of locationIds) {
                        await this.userRepository.query('INSERT INTO user_location_permissions (user_id, role_id, department_id, location_id) VALUES ($1, $2, $3, $4)', [id, userData.roleId, userData.departmentId, parseInt(locationId.toString().trim())]);
                    }
                }
            }
            return this.findOne(id);
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }
    async remove(id) {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
    }
    async toggleStatus(id) {
        const user = await this.findOne(id);
        await this.userRepository.update(id, { isActive: !user.isActive });
        return this.findOne(id);
    }
    async getMobileNumbers(userId) {
        try {
            const query = `
        SELECT id, mobile_number, user_id, last_call_status, assigned_date, created_at
        FROM public.mobile_numbers 
        WHERE user_id = $1
        ORDER BY id ASC
      `;
            console.log('Executing query:', query);
            console.log('With user ID:', userId);
            const mobileNumbers = await this.userRepository.query(query, [userId]);
            console.log('Query result:', mobileNumbers);
            return mobileNumbers;
        }
        catch (error) {
            console.error('Database error:', error);
            try {
                const { Client } = require('pg');
                const client = new Client({
                    host: '127.0.0.1',
                    port: 5432,
                    database: 'postgres',
                    user: 'postgres',
                    password: '12345'
                });
                await client.connect();
                const result = await client.query('SELECT * FROM mobile_numbers WHERE user_id = $1 ORDER BY id', [userId]);
                await client.end();
                console.log('Direct query result:', result.rows);
                return result.rows;
            }
            catch (directError) {
                console.error('Direct query error:', directError);
                return [];
            }
        }
    }
    async debugMobileNumbers() {
        try {
            const tableCheck = await this.userRepository.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'mobile_numbers'
        );
      `);
            console.log('Table exists:', tableCheck[0].exists);
            const query = `SELECT * FROM mobile_numbers ORDER BY created_at DESC LIMIT 10`;
            const allNumbers = await this.userRepository.query(query);
            console.log('All mobile numbers:', allNumbers);
            return allNumbers;
        }
        catch (error) {
            console.error('Error in debug mobile numbers:', error);
            return [{ error: error.message }];
        }
    }
    async saveCallRecord(callData) {
        try {
            const { numberId, disposition, nextCallDate, notes, callerBy } = callData;
            const updateQuery = `
        UPDATE mobile_numbers 
        SET disposition = $1, next_call_date = $2, caller_by = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
      `;
            await this.userRepository.query(updateQuery, [disposition, nextCallDate, callerBy, numberId]);
            return { success: true, message: 'Call record saved successfully' };
        }
        catch (error) {
            console.error('Error saving call record:', error);
            return { success: false, message: 'Failed to save call record' };
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_info_entity_1.UserInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map