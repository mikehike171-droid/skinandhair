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
exports.SystemSettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const system_setting_entity_1 = require("../entities/system-setting.entity");
let SystemSettingsService = class SystemSettingsService {
    constructor(systemSettingRepository) {
        this.systemSettingRepository = systemSettingRepository;
    }
    async getAllSettings() {
        try {
            const result = await this.systemSettingRepository.query('SELECT * FROM hospital_settings ORDER BY id DESC LIMIT 1');
            const settings = result[0] || {};
            return {
                general: {
                    hospital_name: settings?.hospital_name || 'Pranam Hospital Management System',
                    hospital_heading: settings?.hospital_heading || 'Hospital Management System',
                    hospital_logo: settings?.hospital_logo || '/images/pranam-logo.png',
                    timezone: 'Asia/Kolkata',
                    currency: 'INR',
                    dateFormat: 'DD/MM/YYYY',
                },
                security: {
                    passwordMinLength: 8,
                    requireUppercase: true,
                    requireNumbers: true,
                    requireSymbols: false,
                    sessionTimeout: 30,
                    maxLoginAttempts: 5,
                    enable2FA: false,
                },
                notifications: {
                    emailEnabled: true,
                    smsEnabled: false,
                    pushEnabled: true,
                    emailFrom: 'noreply@pranamhms.com',
                },
                system: {
                    maintenanceMode: false,
                    backupFrequency: 'daily',
                    maxFileUploadSize: 10,
                    enableAuditLogs: true,
                },
            };
        }
        catch (error) {
            console.error('Error fetching settings:', error);
            return {
                general: {
                    hospital_name: 'Pranam Hospital Management System',
                    hospital_heading: 'HIMS - Hospital Information Management System',
                    hospital_logo: '/images/pranam-logo.png',
                    timezone: 'Asia/Kolkata',
                    currency: 'INR',
                    dateFormat: 'DD/MM/YYYY',
                },
                security: {
                    passwordMinLength: 8,
                    requireUppercase: true,
                    requireNumbers: true,
                    requireSymbols: false,
                    sessionTimeout: 30,
                    maxLoginAttempts: 5,
                    enable2FA: false,
                },
                notifications: {
                    emailEnabled: true,
                    smsEnabled: false,
                    pushEnabled: true,
                    emailFrom: 'noreply@pranamhms.com',
                },
                system: {
                    maintenanceMode: false,
                    backupFrequency: 'daily',
                    maxFileUploadSize: 10,
                    enableAuditLogs: true,
                },
            };
        }
    }
    async updateSettings(updateDto) {
        try {
            const currentSettings = await this.systemSettingRepository.query('SELECT * FROM hospital_settings ORDER BY id DESC LIMIT 1');
            const current = currentSettings[0] || {};
            const newSettings = {
                hospital_name: current.hospital_name || 'Pranam Hospital Management System',
                hospital_heading: current.hospital_heading || 'Hospital Management System',
                hospital_logo: current.hospital_logo || '/images/pranam-logo.png',
            };
            if (updateDto.general) {
                if (updateDto.general.hospital_name !== undefined) {
                    newSettings.hospital_name = updateDto.general.hospital_name;
                }
                if (updateDto.general.hospital_heading !== undefined) {
                    newSettings.hospital_heading = updateDto.general.hospital_heading;
                }
                if (updateDto.general.hospital_logo !== undefined) {
                    newSettings.hospital_logo = updateDto.general.hospital_logo;
                }
            }
            const result = await this.systemSettingRepository.save(newSettings);
            return { message: 'Settings updated successfully', id: result.id };
        }
        catch (error) {
            console.error('Error updating settings:', error);
            throw new Error(`Failed to update settings: ${error.message}`);
        }
    }
    parseValue(value) {
        try {
            return JSON.parse(value);
        }
        catch {
            return value;
        }
    }
    async getSettingByKey(key) {
        const setting = await this.systemSettingRepository.findOne({ where: {} });
        if (!setting)
            return null;
        switch (key) {
            case 'hospital_name':
                return setting.hospital_name;
            case 'hospital_heading':
                return setting.hospital_heading;
            case 'hospital_logo':
                return setting.hospital_logo;
            default:
                return null;
        }
    }
    async initializeDefaultSettings() {
        const exists = await this.systemSettingRepository.findOne({ where: {} });
        if (!exists) {
            const defaultSettings = this.systemSettingRepository.create({
                hospital_name: 'Pranam Hospital Management System',
                hospital_heading: 'HIMS - Hospital Information Management System',
                hospital_logo: '/images/pranam-logo.png',
            });
            await this.systemSettingRepository.save(defaultSettings);
        }
    }
};
exports.SystemSettingsService = SystemSettingsService;
exports.SystemSettingsService = SystemSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(system_setting_entity_1.SystemSetting)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SystemSettingsService);
//# sourceMappingURL=system-settings.service.js.map