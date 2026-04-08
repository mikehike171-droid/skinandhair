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
exports.FamilyHistoryService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let FamilyHistoryService = class FamilyHistoryService {
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
    async getFamilyHistory() {
        try {
            const result = await this.pool.query('SELECT * FROM family_history ORDER BY id');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to fetch family history');
        }
    }
    async getFamilyHistoryOptions(familyHistoryId) {
        try {
            const result = await this.pool.query('SELECT * FROM family_history_options WHERE family_history_id = $1 ORDER BY id', [familyHistoryId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to fetch family history options');
        }
    }
    async savePatientFamilyHistory(data, user) {
        try {
            const { patient_id, family_history_id, family_history_option_id, category_title, option_title, notes } = data;
            const location_id = data.location_id || user?.primary_location_id || user?.location_id || user?.id;
            await this.pool.query(`
        ALTER TABLE patient_family_history 
        ADD COLUMN IF NOT EXISTS notes TEXT
      `);
            if (!family_history_option_id && notes !== undefined) {
                const updateResult = await this.pool.query('UPDATE patient_family_history SET notes = $1 WHERE patient_id = $2 AND location_id = $3', [notes, patient_id, location_id]);
                if (updateResult.rowCount === 0) {
                    await this.pool.query('INSERT INTO patient_family_history (patient_id, family_history_id, family_history_option_id, category_title, option_title, location_id, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)', [patient_id, 1, 0, 'General', 'Notes Placeholder', location_id, notes]);
                }
                return { success: true, message: 'Notes updated' };
            }
            let numericFamilyHistoryId = family_history_id;
            if (typeof family_history_id === 'string' && isNaN(Number(family_history_id))) {
                const familyHistoryResult = await this.pool.query('SELECT id FROM family_history WHERE title ILIKE $1', [family_history_id]);
                if (familyHistoryResult.rows.length > 0) {
                    numericFamilyHistoryId = familyHistoryResult.rows[0].id;
                }
                else {
                    numericFamilyHistoryId = 1;
                }
            }
            const existingRecord = await this.pool.query('SELECT id FROM patient_family_history WHERE patient_id = $1 AND family_history_option_id = $2 AND location_id = $3', [patient_id, family_history_option_id, location_id]);
            if (existingRecord.rows.length > 0) {
                if (notes !== undefined) {
                    await this.pool.query('UPDATE patient_family_history SET notes = $1 WHERE patient_id = $2 AND location_id = $3', [notes, patient_id, location_id]);
                }
                return { message: 'Record already exists' };
            }
            let finalNotes = notes;
            if (finalNotes === undefined || finalNotes === null || finalNotes === '') {
                const existingNoteResult = await this.pool.query('SELECT notes FROM patient_family_history WHERE patient_id = $1 AND notes IS NOT NULL AND notes != \'\' LIMIT 1', [patient_id]);
                if (existingNoteResult.rows.length > 0) {
                    finalNotes = existingNoteResult.rows[0].notes;
                }
            }
            const result = await this.pool.query('INSERT INTO patient_family_history (patient_id, family_history_id, family_history_option_id, category_title, option_title, location_id, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [patient_id, numericFamilyHistoryId, family_history_option_id, category_title, option_title, location_id, finalNotes]);
            return { success: true, id: result.rows[0].id };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to save family history');
        }
    }
    async getPatientFamilyHistory(patientId, locationId, user) {
        try {
            const numericPatientId = parseInt(patientId);
            const locationIdRaw = locationId || user?.primary_location_id || user?.location_id || 1;
            const location_id = typeof locationIdRaw === 'string' ? parseInt(locationIdRaw.split(',')[0]) : locationIdRaw;
            await this.pool.query(`
        ALTER TABLE patient_family_history 
        ADD COLUMN IF NOT EXISTS notes TEXT
      `);
            const result = await this.pool.query(`SELECT pfh.*, 
         COALESCE(fh.title, pfh.category_title) as family_history_title, 
         COALESCE(fho.title, pfh.option_title) as option_title 
         FROM patient_family_history pfh
         LEFT JOIN family_history fh ON pfh.family_history_id = fh.id
         LEFT JOIN family_history_options fho ON pfh.family_history_option_id = fho.id
         WHERE pfh.patient_id = $1
         ORDER BY COALESCE(fh.title, pfh.category_title), COALESCE(fho.title, pfh.option_title)`, [numericPatientId]);
            const groupedHistory = result.rows.reduce((acc, row) => {
                const category = row.family_history_title;
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push({
                    id: row.id,
                    option_id: row.family_history_option_id,
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
            console.error('Error getting patient family history:', error);
            throw new Error('Failed to fetch patient family history');
        }
    }
    async deletePatientFamilyHistory(data, user) {
        try {
            const { patient_id, family_history_option_id } = data;
            const location_id = data.location_id || user?.primary_location_id || user?.location_id || user?.id;
            await this.pool.query('DELETE FROM patient_family_history WHERE patient_id = $1 AND family_history_option_id = $2 AND location_id = $3', [patient_id, family_history_option_id, location_id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete family history');
        }
    }
};
exports.FamilyHistoryService = FamilyHistoryService;
exports.FamilyHistoryService = FamilyHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FamilyHistoryService);
//# sourceMappingURL=family-history.service.js.map