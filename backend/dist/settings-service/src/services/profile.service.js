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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../entities/user.entity");
const user_info_entity_1 = require("../entities/user-info.entity");
let ProfileService = class ProfileService {
    constructor(userRepository, userInfoRepository) {
        this.userRepository = userRepository;
        this.userInfoRepository = userInfoRepository;
    }
    async getProfile(userId) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['userInfo']
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                userInfo: user.userInfo
            };
        }
        catch (error) {
            console.error('Get profile error:', error);
            throw new common_1.InternalServerErrorException('Failed to get profile');
        }
    }
    async updateProfile(userId, updateData) {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const userUpdateData = {};
            if (updateData.firstName)
                userUpdateData.firstName = updateData.firstName;
            if (updateData.lastName)
                userUpdateData.lastName = updateData.lastName;
            if (updateData.email !== undefined)
                userUpdateData.email = updateData.email;
            if (updateData.phone !== undefined)
                userUpdateData.phone = updateData.phone;
            if (Object.keys(userUpdateData).length > 0) {
                await this.userRepository.update(userId, userUpdateData);
            }
            if (user.userInfoId) {
                const userInfoUpdateData = {};
                if (updateData.alternatePhone !== undefined)
                    userInfoUpdateData.alternatePhone = updateData.alternatePhone;
                if (updateData.address !== undefined)
                    userInfoUpdateData.address = updateData.address;
                if (updateData.pincode !== undefined)
                    userInfoUpdateData.pincode = updateData.pincode;
                if (updateData.qualification !== undefined)
                    userInfoUpdateData.qualification = updateData.qualification;
                if (updateData.yearsOfExperience !== undefined)
                    userInfoUpdateData.yearsOfExperience = updateData.yearsOfExperience;
                if (updateData.medicalRegistrationNumber !== undefined)
                    userInfoUpdateData.medicalRegistrationNumber = updateData.medicalRegistrationNumber;
                if (updateData.registrationCouncil !== undefined)
                    userInfoUpdateData.registrationCouncil = updateData.registrationCouncil;
                if (Object.keys(userInfoUpdateData).length > 0) {
                    await this.userInfoRepository.update(user.userInfoId, userInfoUpdateData);
                }
            }
            else {
                const userInfo = this.userInfoRepository.create({
                    userId: userId,
                    alternatePhone: updateData.alternatePhone,
                    address: updateData.address,
                    pincode: updateData.pincode,
                    qualification: updateData.qualification,
                    yearsOfExperience: updateData.yearsOfExperience,
                    medicalRegistrationNumber: updateData.medicalRegistrationNumber,
                    registrationCouncil: updateData.registrationCouncil,
                });
                await this.userInfoRepository.save(userInfo);
                await this.userRepository.update(userId, { userInfoId: userId });
            }
            return { message: 'Profile updated successfully' };
        }
        catch (error) {
            console.error('Update profile error:', error);
            throw new common_1.InternalServerErrorException('Failed to update profile');
        }
    }
    async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId }
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new common_1.UnauthorizedException('Current password is incorrect');
            }
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await this.userRepository.update(userId, { password: hashedNewPassword });
            return { message: 'Password changed successfully' };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error('Change password error:', error);
            throw new common_1.InternalServerErrorException('Failed to change password');
        }
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_info_entity_1.UserInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProfileService);
//# sourceMappingURL=profile.service.js.map