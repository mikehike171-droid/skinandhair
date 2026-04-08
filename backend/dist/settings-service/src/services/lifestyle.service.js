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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifestyleService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let LifestyleService = class LifestyleService {
    constructor() {
        this.pool = new pg_1.Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {
                rejectUnauthorized: false,
            },
        });
    }
    async getLifestyle() {
        try {
            const result = await this.pool.query('SELECT * FROM lifestyle ORDER BY id');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to fetch lifestyle');
        }
    }
    async getLifestyleOptions(lifestyleId) {
        try {
            const result = await this.pool.query('SELECT * FROM lifestyle_options WHERE lifestyle_id = $1 ORDER BY id', [lifestyleId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to fetch lifestyle options');
        }
    }
    async savePatientLifestyle(data, user) {
        try {
            const { patient_id, lifestyle_id, lifestyle_option_id, category_title, option_title, notes } = data;
            const location_id = data.location_id || user?.primary_location_id || user?.location_id || user?.id;
            await this.pool.query(`
        ALTER TABLE patient_lifestyle 
        ADD COLUMN IF NOT EXISTS notes TEXT
      `);
            if (!lifestyle_option_id && notes !== undefined) {
                const updateResult = await this.pool.query('UPDATE patient_lifestyle SET notes = $1 WHERE patient_id = $2 AND location_id = $3', [notes, patient_id, location_id]);
                if (updateResult.rowCount === 0) {
                    await this.pool.query('INSERT INTO patient_lifestyle (patient_id, lifestyle_id, lifestyle_option_id, category_title, option_title, location_id, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)', [patient_id, 1, 0, 'General', 'Notes Placeholder', location_id, notes]);
                }
                return { success: true, message: 'Notes updated' };
            }
            let numericLifestyleId = lifestyle_id;
            if (typeof lifestyle_id === 'string' && isNaN(Number(lifestyle_id))) {
                const lifestyleResult = await this.pool.query('SELECT id FROM lifestyle WHERE title ILIKE $1', [lifestyle_id]);
                if (lifestyleResult.rows.length > 0) {
                    numericLifestyleId = lifestyleResult.rows[0].id;
                }
                else {
                    numericLifestyleId = 1;
                }
            }
            const existingRecord = await this.pool.query('SELECT id FROM patient_lifestyle WHERE patient_id = $1 AND lifestyle_option_id = $2 AND location_id = $3', [patient_id, lifestyle_option_id, location_id]);
            if (existingRecord.rows.length > 0) {
                if (notes !== undefined) {
                    await this.pool.query('UPDATE patient_lifestyle SET notes = $1 WHERE patient_id = $2 AND location_id = $3', [notes, patient_id, location_id]);
                }
                return { message: 'Record already exists' };
            }
            let finalNotes = notes;
            if (finalNotes === undefined || finalNotes === null || finalNotes === '') {
                const existingNoteResult = await this.pool.query('SELECT notes FROM patient_lifestyle WHERE patient_id = $1 AND notes IS NOT NULL AND notes != \'\' LIMIT 1', [patient_id]);
                if (existingNoteResult.rows.length > 0) {
                    finalNotes = existingNoteResult.rows[0].notes;
                }
            }
            const result = await this.pool.query('INSERT INTO patient_lifestyle (patient_id, lifestyle_id, lifestyle_option_id, category_title, option_title, location_id, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [patient_id, numericLifestyleId, lifestyle_option_id, category_title, option_title, location_id, finalNotes]);
            return { success: true, id: result.rows[0].id };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to save lifestyle');
        }
    }
    async getPatientLifestyle(patientId, locationId, user) {
        try {
            const numericPatientId = parseInt(patientId);
            const locationIdRaw = locationId || user?.primary_location_id || user?.location_id || 1;
            const location_id = typeof locationIdRaw === 'string' ? parseInt(locationIdRaw.split(',')[0]) : locationIdRaw;
            await this.pool.query(`
        ALTER TABLE patient_lifestyle 
        ADD COLUMN IF NOT EXISTS notes TEXT
      `);
            const result = await this.pool.query(`SELECT pl.*, 
         COALESCE(l.title, pl.category_title) as lifestyle_title, 
         COALESCE(lo.title, pl.option_title) as option_title 
         FROM patient_lifestyle pl
         LEFT JOIN lifestyle l ON pl.lifestyle_id = l.id
         LEFT JOIN lifestyle_options lo ON pl.lifestyle_option_id = lo.id
         WHERE pl.patient_id = $1
         ORDER BY COALESCE(l.title, pl.category_title), COALESCE(lo.title, pl.option_title)`, [numericPatientId]);
            const groupedHistory = result.rows.reduce((acc, row) => {
                const category = row.lifestyle_title;
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push({
                    id: row.id,
                    option_id: row.lifestyle_option_id,
                    option_title: row.option_title
                });
                return acc;
            }, {});
            return {
                data: groupedHistory,
                notes: result.rows.find(row => row.notes && row.notes.trim() !== '')?.notes || ''
            };
        }
        catch (error) {
            console.error('Error getting patient lifestyle:', error);
            throw new Error('Failed to fetch patient lifestyle');
        }
    }
    async deletePatientLifestyle(data, user) {
        try {
            const { patient_id, lifestyle_option_id } = data;
            const location_id = data.location_id || user?.primary_location_id || user?.location_id || user?.id;
            await this.pool.query('DELETE FROM patient_lifestyle WHERE patient_id = $1 AND lifestyle_option_id = $2 AND location_id = $3', [patient_id, lifestyle_option_id, location_id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete lifestyle');
        }
    }
};
exports.LifestyleService = LifestyleService;
exports.LifestyleService = LifestyleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LifestyleService);
//# sourceMappingURL=lifestyle.service.js.map