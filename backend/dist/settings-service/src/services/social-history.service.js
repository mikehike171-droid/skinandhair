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
exports.SocialHistoryService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let SocialHistoryService = class SocialHistoryService {
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
    async getSocialHistory() {
        try {
            const result = await this.pool.query('SELECT * FROM social_history ORDER BY id');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to fetch social history');
        }
    }
    async getSocialHistoryOptions(socialHistoryId) {
        try {
            const result = await this.pool.query('SELECT * FROM social_history_options WHERE social_history_id = $1 ORDER BY id', [socialHistoryId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to fetch social history options');
        }
    }
    async savePatientSocialHistory(data, user) {
        try {
            const { patient_id, social_history_id, social_history_option_id, category_title, option_title, notes } = data;
            await this.pool.query(`
        ALTER TABLE patient_social_history 
        ADD COLUMN IF NOT EXISTS notes TEXT
      `);
            const location_id = data.location_id || user?.primary_location_id || user?.location_id || user?.id;
            if (!location_id) {
                throw new Error('Location ID not found in user context');
            }
            if (!social_history_option_id && notes !== undefined) {
                const updateResult = await this.pool.query('UPDATE patient_social_history SET notes = $1 WHERE patient_id = $2 AND location_id = $3', [notes, patient_id, location_id]);
                if (updateResult.rowCount === 0) {
                    await this.pool.query('INSERT INTO patient_social_history (patient_id, social_history_id, social_history_option_id, category_title, option_title, location_id, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)', [patient_id, 1, 0, 'General', 'Notes Placeholder', location_id, notes]);
                }
                return { success: true, message: 'Notes updated' };
            }
            let numericSocialHistoryId = social_history_id;
            if (typeof social_history_id === 'string' && isNaN(Number(social_history_id))) {
                const socialHistoryResult = await this.pool.query('SELECT id FROM social_history WHERE title ILIKE $1', [social_history_id]);
                if (socialHistoryResult.rows.length > 0) {
                    numericSocialHistoryId = socialHistoryResult.rows[0].id;
                }
                else {
                    numericSocialHistoryId = 1;
                }
            }
            const existingRecord = await this.pool.query('SELECT id FROM patient_social_history WHERE patient_id = $1 AND social_history_option_id = $2 AND location_id = $3', [patient_id, social_history_option_id, location_id]);
            if (existingRecord.rows.length > 0) {
                if (notes !== undefined) {
                    await this.pool.query('UPDATE patient_social_history SET notes = $1 WHERE patient_id = $2 AND location_id = $3', [notes, patient_id, location_id]);
                }
                return { message: 'Record already exists' };
            }
            let finalNotes = notes;
            if (finalNotes === undefined || finalNotes === null || finalNotes === '') {
                const existingNoteResult = await this.pool.query('SELECT notes FROM patient_social_history WHERE patient_id = $1 AND notes IS NOT NULL AND notes != \'\' LIMIT 1', [patient_id]);
                if (existingNoteResult.rows.length > 0) {
                    finalNotes = existingNoteResult.rows[0].notes;
                }
            }
            const result = await this.pool.query('INSERT INTO patient_social_history (patient_id, social_history_id, social_history_option_id, category_title, option_title, location_id, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', [patient_id, numericSocialHistoryId, social_history_option_id, category_title, option_title, location_id, finalNotes]);
            return { success: true, id: result.rows[0].id };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to save social history');
        }
    }
    async getPatientSocialHistory(patientId, locationId, user) {
        try {
            const numericPatientId = parseInt(patientId);
            const locationIdRaw = locationId || user?.primary_location_id || user?.location_id || 1;
            const location_id = typeof locationIdRaw === 'string' ? parseInt(locationIdRaw.split(',')[0]) : locationIdRaw;
            await this.pool.query(`
        ALTER TABLE patient_social_history 
        ADD COLUMN IF NOT EXISTS notes TEXT
      `);
            const result = await this.pool.query(`SELECT psh.*, 
         COALESCE(sh.title, psh.category_title) as social_history_title, 
         COALESCE(sho.title, psh.option_title) as option_title 
         FROM patient_social_history psh
         LEFT JOIN social_history sh ON psh.social_history_id = sh.id
         LEFT JOIN social_history_options sho ON psh.social_history_option_id = sho.id
         WHERE psh.patient_id = $1
         ORDER BY COALESCE(sh.title, psh.category_title), COALESCE(sho.title, psh.option_title)`, [numericPatientId]);
            const groupedHistory = result.rows.reduce((acc, row) => {
                const category = row.social_history_title;
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push({
                    id: row.id,
                    option_id: row.social_history_option_id,
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
            console.error('Error getting patient social history:', error);
            throw new Error('Failed to fetch patient social history');
        }
    }
    async deletePatientSocialHistory(data, user) {
        try {
            const { patient_id, social_history_option_id } = data;
            const location_id = data.location_id || user?.primary_location_id || user?.location_id || user?.id;
            if (!location_id) {
                throw new Error('Location ID not found in user context');
            }
            await this.pool.query('DELETE FROM patient_social_history WHERE patient_id = $1 AND social_history_option_id = $2 AND location_id = $3', [patient_id, social_history_option_id, location_id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete social history');
        }
    }
};
exports.SocialHistoryService = SocialHistoryService;
exports.SocialHistoryService = SocialHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SocialHistoryService);
//# sourceMappingURL=social-history.service.js.map