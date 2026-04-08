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
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const location_entity_1 = require("./entities/location.entity");
let LocationsService = class LocationsService {
    constructor(locationRepository) {
        this.locationRepository = locationRepository;
    }
    async findAll() {
        return this.locationRepository.find({ order: { name: 'ASC' } });
    }
    async findByUserLocations(userLocationIds) {
        try {
            console.log('Service - userLocationIds:', userLocationIds);
            if (!userLocationIds || userLocationIds.length === 0) {
                const result = await this.locationRepository.find({
                    where: { isActive: true },
                    order: { id: 'ASC' }
                });
                console.log('Service - all locations for admin:', result.length);
                return result;
            }
            const result = await this.locationRepository.find({
                where: {
                    id: userLocationIds.length === 1 ? userLocationIds[0] : (0, typeorm_2.In)(userLocationIds),
                    isActive: true
                },
                order: { id: 'ASC' }
            });
            console.log('Service - user specific locations:', result.length);
            return result;
        }
        catch (error) {
            console.error('Service error:', error);
            throw error;
        }
    }
    async findByUserLocation(userLocationId) {
        return this.findByUserLocations(userLocationId ? [userLocationId] : []);
    }
    async findOne(id) {
        return this.locationRepository.findOne({ where: { id: parseInt(id) } });
    }
    async create(locationData) {
        const location = this.locationRepository.create(locationData);
        return this.locationRepository.save(location);
    }
    async update(id, locationData) {
        await this.locationRepository.update(id, locationData);
        return this.findOne(id.toString());
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LocationsService);
//# sourceMappingURL=locations.service.js.map