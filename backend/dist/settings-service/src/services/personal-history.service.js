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
exports.PersonalHistoryService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let PersonalHistoryService = class PersonalHistoryService {
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
    async getPersonalHistory() {
        try {
            const result = await this.pool.query('SELECT * FROM personal_history ORDER BY id');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to fetch personal history');
        }
    }
    async getPersonalHistoryOptions(historyId) {
        try {
            const result = await this.pool.query('SELECT * FROM personal_history_options WHERE personal_history_id = $1 ORDER BY id', [historyId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to fetch personal history options');
        }
    }
    async createPersonalHistory(data) {
        try {
            const { title, description, location_id } = data;
            const result = await this.pool.query('INSERT INTO personal_history (title, description, location_id) VALUES ($1, $2, $3) RETURNING *', [title, description, location_id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create personal history');
        }
    }
    async updatePersonalHistory(id, data) {
        try {
            const { title, description, location_id } = data;
            const result = await this.pool.query('UPDATE personal_history SET title = $1, description = $2, location_id = $3 WHERE id = $4 RETURNING *', [title, description, location_id, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update personal history');
        }
    }
    async savePatientPersonalHistory(data, user) {
        try {
            const { patient_id, personal_history_id, personal_history_option_id, category_title, option_title, notes } = data;
            const location_id = data.location_id || user?.primary_location_id || user?.location_id || user?.id;
            if (!location_id) {
                throw new Error('Location ID not found in user context');
            }
            await this.pool.query(`
        ALTER TABLE patient_personal_history 
        ADD COLUMN IF NOT EXISTS notes TEXT
      `);
            if (!personal_history_option_id && notes !== undefined) {
                const updateResult = await this.pool.query('UPDATE patient_personal_history SET notes = $1 WHERE patient_id = $2 AND location_id = $3', [notes, patient_id, location_id]);
                if (updateResult.rowCount === 0) {
                    await this.pool.query('INSERT INTO patient_personal_history (patient_id, personal_history_id, personal_history_option_id, category_title, option_title, location_id, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)', [patient_id, 1, 0, 'General', 'Notes Placeholder', location_id, notes]);
                }
                return { success: true, message: 'Notes updated' };
            }
            const personalHistoryResult = await this.pool.query('SELECT id FROM personal_history WHERE title = $1', [personal_history_id]);
            if (personalHistoryResult.rows.length === 0) {
                throw new Error(`Personal history not found with title: ${personal_history_id}`);
            }
            const numericPersonalHistoryId = personalHistoryResult.rows[0].id;
            const existingRecord = await this.pool.query('SELECT id FROM patient_personal_history WHERE patient_id = $1 AND personal_history_option_id = $2 AND location_id = $3', [patient_id, personal_history_option_id, location_id]);
            if (existingRecord.rows.length > 0) {
                if (notes !== undefined) {
                    await this.pool.query('UPDATE patient_personal_history SET notes = $1 WHERE patient_id = $2 AND location_id = $3', [notes, patient_id, location_id]);
                }
                return { message: 'Record already exists' };
            }
            let finalNotes = notes;
            if (finalNotes === undefined || finalNotes === null || finalNotes === '') {
                const existingNoteResult = await this.pool.query('SELECT notes FROM patient_personal_history WHERE patient_id = $1 AND notes IS NOT NULL AND notes != \'\' LIMIT 1', [patient_id]);
                if (existingNoteResult.rows.length > 0) {
                    finalNotes = existingNoteResult.rows[0].notes;
                }
            }
            const result = await this.pool.query('INSERT INTO patient_personal_history (patient_id, personal_history_id, personal_history_option_id, category_title, option_title, location_id, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [patient_id, numericPersonalHistoryId, personal_history_option_id, category_title, option_title, location_id, finalNotes]);
            return { success: true, id: result.rows[0].id };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to save personal history');
        }
    }
    async getPatientPersonalHistory(patientId, locationId, user) {
        try {
            const numericPatientId = parseInt(patientId);
            const locationIdRaw = locationId || user?.primary_location_id || user?.location_id || 1;
            const location_id = typeof locationIdRaw === 'string' ? parseInt(locationIdRaw.split(',')[0]) : locationIdRaw;
            await this.pool.query(`
        ALTER TABLE patient_personal_history 
        ADD COLUMN IF NOT EXISTS notes TEXT
      `);
            const result = await this.pool.query(`SELECT pph.*, 
         COALESCE(ph.title, pph.category_title) as personal_history_title, 
         COALESCE(pho.title, pph.option_title) as option_title 
         FROM patient_personal_history pph
         LEFT JOIN personal_history ph ON pph.personal_history_id = ph.id
         LEFT JOIN personal_history_options pho ON pph.personal_history_option_id = pho.id
         WHERE pph.patient_id = $1
         ORDER BY COALESCE(ph.title, pph.category_title), COALESCE(pho.title, pph.option_title)`, [numericPatientId]);
            const groupedHistory = result.rows.reduce((acc, row) => {
                const category = row.personal_history_title;
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push({
                    id: row.id,
                    option_id: row.personal_history_option_id,
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
            console.error('Error getting patient personal history:', error);
            throw new Error('Failed to fetch patient personal history');
        }
    }
    async deletePatientPersonalHistory(data, user) {
        try {
            const { patient_id, personal_history_option_id } = data;
            const location_id = data.location_id || user?.primary_location_id || user?.location_id || user?.id;
            if (!location_id) {
                throw new Error('Location ID not found in user context');
            }
            await this.pool.query('DELETE FROM patient_personal_history WHERE patient_id = $1 AND personal_history_option_id = $2 AND location_id = $3', [patient_id, personal_history_option_id, location_id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete personal history');
        }
    }
};
exports.PersonalHistoryService = PersonalHistoryService;
exports.PersonalHistoryService = PersonalHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PersonalHistoryService);
//# sourceMappingURL=personal-history.service.js.map