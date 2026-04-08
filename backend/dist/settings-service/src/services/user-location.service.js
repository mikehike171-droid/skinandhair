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
exports.UserLocationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
let UserLocationService = class UserLocationService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getUserLocationId(userId) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId }
            });
            if (!user) {
                throw new Error('User not found');
            }
            if (user.primaryLocationId) {
                return user.primaryLocationId;
            }
            const locationPermission = await this.userRepository.query('SELECT location_id FROM user_location_permissions WHERE user_id = $1 AND location_id IS NOT NULL LIMIT 1', [userId]);
            if (locationPermission.length > 0) {
                return locationPermission[0].location_id;
            }
            return 1;
        }
        catch (error) {
            console.error('Error getting user location:', error);
            return 1;
        }
    }
    async getUserDetails(userId) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId }
            });
            if (!user) {
                throw new Error('User not found');
            }
            const locationId = await this.getUserLocationId(userId);
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                locationId: locationId,
                primaryLocationId: user.primaryLocationId
            };
        }
        catch (error) {
            console.error('Error getting user details:', error);
            throw error;
        }
    }
};
exports.UserLocationService = UserLocationService;
exports.UserLocationService = UserLocationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserLocationService);
//# sourceMappingURL=user-location.service.js.map