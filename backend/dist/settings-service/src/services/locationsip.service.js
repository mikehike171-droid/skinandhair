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
exports.LocationsIpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const location_entity_1 = require("../entities/location.entity");
let LocationsIpService = class LocationsIpService {
    constructor(locationRepository) {
        this.locationRepository = locationRepository;
    }
    async findAll() {
        await this.locationRepository.query(`
      CREATE TABLE IF NOT EXISTS "locationsIp" (
        id SERIAL PRIMARY KEY,
        ip VARCHAR(45) NOT NULL,
        location_id INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        return this.locationRepository.query(`SELECT li.*, l.name as location_name 
       FROM "locationsIp" li 
       LEFT JOIN locations l ON l.id = li.location_id 
       ORDER BY li.created_at DESC`);
    }
    async create(data) {
        const result = await this.locationRepository.query('INSERT INTO "locationsIp" (ip, location_id, status, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *', [data.ip, data.locationId, data.status || 'active']);
        return result[0];
    }
    async update(id, data) {
        const result = await this.locationRepository.query('UPDATE "locationsIp" SET ip = $1, location_id = $2, status = $3, updated_at = NOW() WHERE id = $4 RETURNING *', [data.ip, data.locationId, data.status, id]);
        return result[0];
    }
    async remove(id) {
        await this.locationRepository.query('DELETE FROM "locationsIp" WHERE id = $1', [id]);
        return { success: true };
    }
};
exports.LocationsIpService = LocationsIpService;
exports.LocationsIpService = LocationsIpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LocationsIpService);
//# sourceMappingURL=locationsip.service.js.map