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
exports.MedicalHistoryService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
let MedicalHistoryService = class MedicalHistoryService {
    constructor(userRepository) {
        this.userRepository = userRepository;
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
    async ensureTable(tableName, schema) {
        try {
            await this.pool.query(schema);
            await this.pool.query(`ALTER TABLE ${tableName} DROP COLUMN IF EXISTS location_id`);
        }
        catch (error) {
            console.error(`Error ensuring table ${tableName}:`, error);
        }
    }
    async ensureMedicalHistoryTable() {
        await this.ensureTable('medical_history', `
      CREATE TABLE IF NOT EXISTS medical_history (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureMedicalHistoryOptionsTable() {
        await this.ensureMedicalHistoryTable();
        await this.ensureTable('medical_history_options', `
      CREATE TABLE IF NOT EXISTS medical_history_options (
        id SERIAL PRIMARY KEY,
        medical_history_id INTEGER REFERENCES medical_history(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensurePersonalHistoryTable() {
        await this.ensureTable('personal_history', `
      CREATE TABLE IF NOT EXISTS personal_history (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensurePersonalHistoryOptionsTable() {
        await this.ensurePersonalHistoryTable();
        await this.ensureTable('personal_history_options', `
      CREATE TABLE IF NOT EXISTS personal_history_options (
        id SERIAL PRIMARY KEY,
        personal_history_id INTEGER REFERENCES personal_history(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureLifestyleTable() {
        await this.ensureTable('lifestyle', `
      CREATE TABLE IF NOT EXISTS lifestyle (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureLifestyleOptionsTable() {
        await this.ensureLifestyleTable();
        await this.ensureTable('lifestyle_options', `
      CREATE TABLE IF NOT EXISTS lifestyle_options (
        id SERIAL PRIMARY KEY,
        lifestyle_id INTEGER REFERENCES lifestyle(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureFamilyHistoryTable() {
        await this.ensureTable('family_history', `
      CREATE TABLE IF NOT EXISTS family_history (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureFamilyHistoryOptionsTable() {
        await this.ensureFamilyHistoryTable();
        await this.ensureTable('family_history_options', `
      CREATE TABLE IF NOT EXISTS family_history_options (
        id SERIAL PRIMARY KEY,
        family_history_id INTEGER REFERENCES family_history(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureDrugHistoryTable() {
        await this.ensureTable('drug_history', `
      CREATE TABLE IF NOT EXISTS drug_history (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureDrugHistoryOptionsTable() {
        await this.ensureDrugHistoryTable();
        await this.ensureTable('drug_history_options', `
      CREATE TABLE IF NOT EXISTS drug_history_options (
        id SERIAL PRIMARY KEY,
        drug_history_id INTEGER REFERENCES drug_history(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureAllergiesTable() {
        await this.ensureTable('allergies', `
      CREATE TABLE IF NOT EXISTS allergies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureAllergiesOptionsTable() {
        await this.ensureAllergiesTable();
        await this.ensureTable('allergies_options', `
      CREATE TABLE IF NOT EXISTS allergies_options (
        id SERIAL PRIMARY KEY,
        allergies_id INTEGER REFERENCES allergies(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureSocialHistoryTable() {
        await this.ensureTable('social_history', `
      CREATE TABLE IF NOT EXISTS social_history (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureSocialHistoryOptionsTable() {
        await this.ensureSocialHistoryTable();
        await this.ensureTable('social_history_options', `
      CREATE TABLE IF NOT EXISTS social_history_options (
        id SERIAL PRIMARY KEY,
        social_history_id INTEGER REFERENCES social_history(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureMedicationTypeTable() {
        await this.ensureTable('medication_type', `
      CREATE TABLE IF NOT EXISTS medication_type (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureMedicineTable() {
        await this.ensureTable('medicine', `
      CREATE TABLE IF NOT EXISTS medicine (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensurePotencyTable() {
        await this.ensureTable('potency', `
      CREATE TABLE IF NOT EXISTS potency (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    async ensureDosageTable() {
        await this.ensureTable('dosage', `
      CREATE TABLE IF NOT EXISTS dosage (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
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
    async getMedicalHistory() {
        try {
            await this.ensureMedicalHistoryTable();
            const result = await this.pool.query(`SELECT * FROM medical_history ORDER BY title`);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createMedicalHistory(data) {
        try {
            await this.ensureMedicalHistoryTable();
            const result = await this.pool.query('INSERT INTO medical_history (title, description) VALUES ($1, $2) RETURNING *', [data.title, data.description]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create medical history');
        }
    }
    async updateMedicalHistory(id, data) {
        try {
            await this.ensureMedicalHistoryTable();
            const result = await this.pool.query('UPDATE medical_history SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.title, data.description, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update medical history');
        }
    }
    async deleteMedicalHistory(id) {
        try {
            await this.ensureMedicalHistoryTable();
            await this.pool.query('DELETE FROM medical_history WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete medical history');
        }
    }
    async getMedicalHistoryOptions(historyId) {
        try {
            await this.ensureMedicalHistoryOptionsTable();
            const result = await this.pool.query('SELECT * FROM medical_history_options WHERE medical_history_id = $1 ORDER BY title', [historyId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createMedicalHistoryOption(data) {
        try {
            await this.ensureMedicalHistoryOptionsTable();
            const result = await this.pool.query('INSERT INTO medical_history_options (medical_history_id, title) VALUES ($1, $2) RETURNING *', [data.medical_history_id, data.title]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create medical history option');
        }
    }
    async updateMedicalHistoryOption(id, data) {
        try {
            await this.ensureMedicalHistoryOptionsTable();
            const result = await this.pool.query('UPDATE medical_history_options SET medical_history_id = $1, title = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.medical_history_id, data.title, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update medical history option');
        }
    }
    async deleteMedicalHistoryOption(id) {
        try {
            await this.ensureMedicalHistoryOptionsTable();
            await this.pool.query('DELETE FROM medical_history_options WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete medical history option');
        }
    }
    async getAllMedicalHistoryOptions() {
        try {
            await this.ensureMedicalHistoryOptionsTable();
            const result = await this.pool.query('SELECT * FROM medical_history_options ORDER BY title');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async getPersonalHistory() {
        try {
            await this.ensurePersonalHistoryTable();
            const result = await this.pool.query(`SELECT * FROM personal_history ORDER BY title`);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createPersonalHistory(data) {
        try {
            await this.ensurePersonalHistoryTable();
            const result = await this.pool.query('INSERT INTO personal_history (title, description) VALUES ($1, $2) RETURNING *', [data.title, data.description]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create personal history');
        }
    }
    async updatePersonalHistory(id, data) {
        try {
            await this.ensurePersonalHistoryTable();
            const result = await this.pool.query('UPDATE personal_history SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.title, data.description, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update personal history');
        }
    }
    async deletePersonalHistory(id) {
        try {
            await this.ensurePersonalHistoryTable();
            await this.pool.query('DELETE FROM personal_history WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete personal history');
        }
    }
    async getPersonalHistoryOptions(historyId) {
        try {
            await this.ensurePersonalHistoryOptionsTable();
            const result = await this.pool.query('SELECT * FROM personal_history_options WHERE personal_history_id = $1 ORDER BY title', [historyId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createPersonalHistoryOption(data) {
        try {
            await this.ensurePersonalHistoryOptionsTable();
            const result = await this.pool.query('INSERT INTO personal_history_options (personal_history_id, title) VALUES ($1, $2) RETURNING *', [data.personal_history_id, data.title]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create personal history option');
        }
    }
    async updatePersonalHistoryOption(id, data) {
        try {
            await this.ensurePersonalHistoryOptionsTable();
            const result = await this.pool.query('UPDATE personal_history_options SET personal_history_id = $1, title = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.personal_history_id, data.title, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update personal history option');
        }
    }
    async deletePersonalHistoryOption(id) {
        try {
            await this.ensurePersonalHistoryOptionsTable();
            await this.pool.query('DELETE FROM personal_history_options WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete personal history option');
        }
    }
    async getAllPersonalHistoryOptions() {
        try {
            await this.ensurePersonalHistoryOptionsTable();
            const result = await this.pool.query('SELECT * FROM personal_history_options ORDER BY title');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async getLifestyle() {
        try {
            await this.ensureLifestyleTable();
            const result = await this.pool.query(`SELECT * FROM lifestyle ORDER BY title`);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createLifestyle(data) {
        try {
            await this.ensureLifestyleTable();
            const result = await this.pool.query('INSERT INTO lifestyle (title, description) VALUES ($1, $2) RETURNING *', [data.title, data.description]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create lifestyle');
        }
    }
    async updateLifestyle(id, data) {
        try {
            await this.ensureLifestyleTable();
            const result = await this.pool.query('UPDATE lifestyle SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.title, data.description, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update lifestyle');
        }
    }
    async deleteLifestyle(id) {
        try {
            await this.ensureLifestyleTable();
            await this.pool.query('DELETE FROM lifestyle WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete lifestyle');
        }
    }
    async getLifestyleOptions(lifestyleId) {
        try {
            await this.ensureLifestyleOptionsTable();
            const result = await this.pool.query('SELECT * FROM lifestyle_options WHERE lifestyle_id = $1 ORDER BY title', [lifestyleId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createLifestyleOption(data) {
        try {
            await this.ensureLifestyleOptionsTable();
            const result = await this.pool.query('INSERT INTO lifestyle_options (lifestyle_id, title) VALUES ($1, $2) RETURNING *', [data.lifestyle_id, data.title]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create lifestyle option');
        }
    }
    async updateLifestyleOption(id, data) {
        try {
            await this.ensureLifestyleOptionsTable();
            const result = await this.pool.query('UPDATE lifestyle_options SET lifestyle_id = $1, title = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.lifestyle_id, data.title, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update lifestyle option');
        }
    }
    async deleteLifestyleOption(id) {
        try {
            await this.ensureLifestyleOptionsTable();
            await this.pool.query('DELETE FROM lifestyle_options WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete lifestyle option');
        }
    }
    async getAllLifestyleOptions() {
        try {
            await this.ensureLifestyleOptionsTable();
            const result = await this.pool.query('SELECT * FROM lifestyle_options ORDER BY title');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async getFamilyHistory() {
        try {
            await this.ensureFamilyHistoryTable();
            const result = await this.pool.query(`SELECT * FROM family_history ORDER BY title`);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createFamilyHistory(data) {
        try {
            await this.ensureFamilyHistoryTable();
            const result = await this.pool.query('INSERT INTO family_history (title, description) VALUES ($1, $2) RETURNING *', [data.title, data.description]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create family history');
        }
    }
    async updateFamilyHistory(id, data) {
        try {
            await this.ensureFamilyHistoryTable();
            const result = await this.pool.query('UPDATE family_history SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.title, data.description, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update family history');
        }
    }
    async deleteFamilyHistory(id) {
        try {
            await this.ensureFamilyHistoryTable();
            await this.pool.query('DELETE FROM family_history WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete family history');
        }
    }
    async getFamilyHistoryOptions(familyHistoryId) {
        try {
            await this.ensureFamilyHistoryOptionsTable();
            const result = await this.pool.query('SELECT * FROM family_history_options WHERE family_history_id = $1 ORDER BY title', [familyHistoryId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createFamilyHistoryOption(data) {
        try {
            await this.ensureFamilyHistoryOptionsTable();
            const result = await this.pool.query('INSERT INTO family_history_options (family_history_id, title) VALUES ($1, $2) RETURNING *', [data.family_history_id, data.title]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create family history option');
        }
    }
    async updateFamilyHistoryOption(id, data) {
        try {
            await this.ensureFamilyHistoryOptionsTable();
            const result = await this.pool.query('UPDATE family_history_options SET family_history_id = $1, title = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.family_history_id, data.title, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update family history option');
        }
    }
    async deleteFamilyHistoryOption(id) {
        try {
            await this.ensureFamilyHistoryOptionsTable();
            await this.pool.query('DELETE FROM family_history_options WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete family history option');
        }
    }
    async getAllFamilyHistoryOptions() {
        try {
            await this.ensureFamilyHistoryOptionsTable();
            const result = await this.pool.query('SELECT * FROM family_history_options ORDER BY title');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async getDrugHistory() {
        try {
            await this.ensureDrugHistoryTable();
            const result = await this.pool.query(`SELECT * FROM drug_history ORDER BY title`);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createDrugHistory(data) {
        try {
            await this.ensureDrugHistoryTable();
            const result = await this.pool.query('INSERT INTO drug_history (title, description) VALUES ($1, $2) RETURNING *', [data.title, data.description]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create drug history');
        }
    }
    async updateDrugHistory(id, data) {
        try {
            await this.ensureDrugHistoryTable();
            const result = await this.pool.query('UPDATE drug_history SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.title, data.description, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update drug history');
        }
    }
    async deleteDrugHistory(id) {
        try {
            await this.ensureDrugHistoryTable();
            await this.pool.query('DELETE FROM drug_history WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete drug history');
        }
    }
    async getDrugHistoryOptions(drugHistoryId) {
        try {
            await this.ensureDrugHistoryOptionsTable();
            const result = await this.pool.query('SELECT * FROM drug_history_options WHERE drug_history_id = $1 ORDER BY title', [drugHistoryId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createDrugHistoryOption(data) {
        try {
            await this.ensureDrugHistoryOptionsTable();
            const result = await this.pool.query('INSERT INTO drug_history_options (drug_history_id, title) VALUES ($1, $2) RETURNING *', [data.drug_history_id, data.title]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create drug history option');
        }
    }
    async updateDrugHistoryOption(id, data) {
        try {
            await this.ensureDrugHistoryOptionsTable();
            const result = await this.pool.query('UPDATE drug_history_options SET drug_history_id = $1, title = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.drug_history_id, data.title, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update drug history option');
        }
    }
    async deleteDrugHistoryOption(id) {
        try {
            await this.ensureDrugHistoryOptionsTable();
            await this.pool.query('DELETE FROM drug_history_options WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete drug history option');
        }
    }
    async getAllDrugHistoryOptions() {
        try {
            await this.ensureDrugHistoryOptionsTable();
            const result = await this.pool.query('SELECT * FROM drug_history_options ORDER BY title');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async getAllergies() {
        try {
            await this.ensureAllergiesTable();
            const result = await this.pool.query(`SELECT * FROM allergies ORDER BY title`);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createAllergy(data) {
        try {
            await this.ensureAllergiesTable();
            const result = await this.pool.query('INSERT INTO allergies (title, description) VALUES ($1, $2) RETURNING *', [data.title, data.description]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create allergy');
        }
    }
    async updateAllergy(id, data) {
        try {
            await this.ensureAllergiesTable();
            const result = await this.pool.query('UPDATE allergies SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.title, data.description, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update allergy');
        }
    }
    async deleteAllergy(id) {
        try {
            await this.ensureAllergiesTable();
            await this.pool.query('DELETE FROM allergies WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete allergy');
        }
    }
    async getAllergiesOptions(allergyId) {
        try {
            await this.ensureAllergiesOptionsTable();
            const result = await this.pool.query('SELECT * FROM allergies_options WHERE allergies_id = $1 ORDER BY title', [allergyId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createAllergyOption(data) {
        try {
            await this.ensureAllergiesOptionsTable();
            const result = await this.pool.query('INSERT INTO allergies_options (allergies_id, title) VALUES ($1, $2) RETURNING *', [data.allergy_id, data.title]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create allergy option');
        }
    }
    async updateAllergyOption(id, data) {
        try {
            await this.ensureAllergiesOptionsTable();
            const result = await this.pool.query('UPDATE allergies_options SET allergies_id = $1, title = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.allergy_id, data.title, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update allergy option');
        }
    }
    async deleteAllergyOption(id) {
        try {
            await this.ensureAllergiesOptionsTable();
            await this.pool.query('DELETE FROM allergies_options WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete allergy option');
        }
    }
    async getAllAllergiesOptions() {
        try {
            await this.ensureAllergiesOptionsTable();
            const result = await this.pool.query('SELECT * FROM allergies_options ORDER BY title');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async getSocialHistory() {
        try {
            await this.ensureSocialHistoryTable();
            const result = await this.pool.query(`SELECT * FROM social_history ORDER BY title`);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createSocialHistory(data) {
        try {
            await this.ensureSocialHistoryTable();
            const result = await this.pool.query('INSERT INTO social_history (title, description) VALUES ($1, $2) RETURNING *', [data.title, data.description]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create social history');
        }
    }
    async updateSocialHistory(id, data) {
        try {
            await this.ensureSocialHistoryTable();
            const result = await this.pool.query('UPDATE social_history SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.title, data.description, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update social history');
        }
    }
    async deleteSocialHistory(id) {
        try {
            await this.ensureSocialHistoryTable();
            await this.pool.query('DELETE FROM social_history WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete social history');
        }
    }
    async getSocialHistoryOptions(socialHistoryId) {
        try {
            await this.ensureSocialHistoryOptionsTable();
            const result = await this.pool.query('SELECT * FROM social_history_options WHERE social_history_id = $1 ORDER BY title', [socialHistoryId]);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createSocialHistoryOption(data) {
        try {
            await this.ensureSocialHistoryOptionsTable();
            const result = await this.pool.query('INSERT INTO social_history_options (social_history_id, title) VALUES ($1, $2) RETURNING *', [data.social_history_id, data.title]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create social history option');
        }
    }
    async updateSocialHistoryOption(id, data) {
        try {
            await this.ensureSocialHistoryOptionsTable();
            const result = await this.pool.query('UPDATE social_history_options SET social_history_id = $1, title = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.social_history_id, data.title, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update social history option');
        }
    }
    async deleteSocialHistoryOption(id) {
        try {
            await this.ensureSocialHistoryOptionsTable();
            await this.pool.query('DELETE FROM social_history_options WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete social history option');
        }
    }
    async getAllSocialHistoryOptions() {
        try {
            await this.ensureSocialHistoryOptionsTable();
            const result = await this.pool.query('SELECT * FROM social_history_options ORDER BY title');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async getMedicationType() {
        try {
            await this.ensureMedicationTypeTable();
            const result = await this.pool.query('SELECT * FROM medication_type ORDER BY title');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createMedicationType(data) {
        try {
            await this.ensureMedicationTypeTable();
            const result = await this.pool.query('INSERT INTO medication_type (title, description) VALUES ($1, $2) RETURNING *', [data.title, data.description]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create medication type');
        }
    }
    async updateMedicationType(id, data) {
        try {
            await this.ensureMedicationTypeTable();
            const result = await this.pool.query('UPDATE medication_type SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.title, data.description, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update medication type');
        }
    }
    async deleteMedicationType(id) {
        try {
            await this.ensureMedicationTypeTable();
            await this.pool.query('DELETE FROM medication_type WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete medication type');
        }
    }
    async getMedicine() {
        try {
            await this.ensureMedicineTable();
            const result = await this.pool.query('SELECT * FROM medicine ORDER BY title');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createMedicine(data) {
        try {
            await this.ensureMedicineTable();
            const result = await this.pool.query('INSERT INTO medicine (title, description) VALUES ($1, $2) RETURNING *', [data.title, data.description]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create medicine');
        }
    }
    async updateMedicine(id, data) {
        try {
            await this.ensureMedicineTable();
            const result = await this.pool.query('UPDATE medicine SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.title, data.description, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update medicine');
        }
    }
    async deleteMedicine(id) {
        try {
            await this.ensureMedicineTable();
            await this.pool.query('DELETE FROM medicine WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete medicine');
        }
    }
    async getPotency() {
        try {
            await this.ensurePotencyTable();
            const result = await this.pool.query('SELECT * FROM potency ORDER BY title');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createPotency(data) {
        try {
            await this.ensurePotencyTable();
            const result = await this.pool.query('INSERT INTO potency (title, description) VALUES ($1, $2) RETURNING *', [data.title, data.description]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create potency');
        }
    }
    async updatePotency(id, data) {
        try {
            await this.ensurePotencyTable();
            const result = await this.pool.query('UPDATE potency SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.title, data.description, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update potency');
        }
    }
    async deletePotency(id) {
        try {
            await this.ensurePotencyTable();
            await this.pool.query('DELETE FROM potency WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete potency');
        }
    }
    async getDosage() {
        try {
            await this.ensureDosageTable();
            const result = await this.pool.query('SELECT * FROM dosage ORDER BY title');
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async createDosage(data) {
        try {
            await this.ensureDosageTable();
            const result = await this.pool.query('INSERT INTO dosage (title, description) VALUES ($1, $2) RETURNING *', [data.title, data.description]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to create dosage');
        }
    }
    async updateDosage(id, data) {
        try {
            await this.ensureDosageTable();
            const result = await this.pool.query('UPDATE dosage SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *', [data.title, data.description, id]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update dosage');
        }
    }
    async deleteDosage(id) {
        try {
            await this.ensureDosageTable();
            await this.pool.query('DELETE FROM dosage WHERE id = $1', [id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete dosage');
        }
    }
    async getPharmacyPrescriptions(locationId) {
        try {
            await this.pool.query(`
        ALTER TABLE patient_prescriptions 
        ADD COLUMN IF NOT EXISTS status INTEGER DEFAULT 0
      `);
            const whereClause = locationId ? 'WHERE pp.location_id = $1 AND pp.status = 0' : 'WHERE pp.status = 0';
            const params = locationId ? [locationId] : [];
            const result = await this.pool.query(`
        SELECT 
          pp.id as prescription_id,
          pp.patient_id,
          pp.medicine_days,
          pp.next_appointment_date,
          pp.notes_to_pro,
          pp.notes_to_pharmacy,
          pp.status,
          pp.created_at,
          COALESCE(p.first_name || ' ' || p.last_name, 'Unknown Patient') as patient_name,
          json_agg(
            json_build_object(
              'medicine_id', pm.id,
              'medicine_type', pm.medicine_type,
              'medicine', pm.medicine,
              'potency', pm.potency,
              'dosage', pm.dosage,
              'morning', pm.morning,
              'afternoon', pm.afternoon,
              'night', pm.night
            )
          ) FILTER (WHERE pm.id IS NOT NULL) as medicines
        FROM patient_prescriptions pp
        LEFT JOIN prescription_medicines pm ON pp.id = pm.patient_prescriptions_id
        LEFT JOIN patients p ON pp.patient_id = p.id
        ${whereClause}
        GROUP BY pp.id, pp.patient_id, pp.medicine_days, pp.next_appointment_date, 
                 pp.notes_to_pro, pp.notes_to_pharmacy, pp.status, pp.created_at, p.first_name, p.last_name
        ORDER BY pp.created_at DESC
      `, params);
            return result.rows;
        }
        catch (error) {
            console.error('Database error:', error);
            return [];
        }
    }
    async updatePrescriptionStatus(prescriptionId, status) {
        try {
            const result = await this.pool.query('UPDATE patient_prescriptions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [status, prescriptionId]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update prescription status');
        }
    }
    async getPatientExaminations(locationId, page = 1, limit = 10, fromDate, toDate, search) {
        try {
            const offset = (page - 1) * limit;
            let whereClause = '';
            const params = [];
            let paramIndex = 1;
            const conditions = [];
            if (locationId) {
                conditions.push(`pe.location_id = $${paramIndex}`);
                params.push(locationId);
                paramIndex++;
            }
            if (fromDate) {
                conditions.push(`pe.created_at >= $${paramIndex}`);
                params.push(fromDate);
                paramIndex++;
            }
            if (toDate) {
                conditions.push(`pe.created_at <= $${paramIndex}`);
                params.push(toDate + ' 23:59:59');
                paramIndex++;
            }
            if (search) {
                conditions.push(`(p.first_name ILIKE $${paramIndex} OR p.last_name ILIKE $${paramIndex} OR (p.first_name || ' ' || p.last_name) ILIKE $${paramIndex})`);
                params.push(`%${search}%`);
                paramIndex++;
            }
            if (conditions.length > 0) {
                whereClause = 'WHERE ' + conditions.join(' AND ');
            }
            const countResult = await this.pool.query(`
        SELECT COUNT(*) as total
        FROM patient_examination pe
        LEFT JOIN patients p ON pe.patient_id::text = p.id::text
        ${whereClause}
      `, params);
            const total = parseInt(countResult.rows[0].total);
            const totalPages = Math.ceil(total / limit);
            const dataParams = [...params, limit, offset];
            const result = await this.pool.query(`
        SELECT 
          pe.id,
          pe.patient_id,
          pe.treatment_plan_months_doctor,
          pe.next_renewal_date_doctor,
          pe.treatment_plan_months_pro,
          pe.next_renewal_date_pro,
          pe.created_at,
          COALESCE(p.first_name || ' ' || p.last_name, 'Unknown Patient') as patient_name
        FROM patient_examination pe
        LEFT JOIN patients p ON pe.patient_id::text = p.id::text
        ${whereClause}
        ORDER BY pe.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `, dataParams);
            return {
                data: result.rows,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };
        }
        catch (error) {
            console.error('Database error:', error);
            return {
                data: [],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                    hasNext: false,
                    hasPrev: false
                }
            };
        }
    }
    async savePatientMedicalHistory(data, user) {
        try {
            const { patient_id, medical_history_id, medical_history_option_id, category_title, option_title, notes } = data;
            await this.pool.query(`
        ALTER TABLE patient_medical_history 
        ADD COLUMN IF NOT EXISTS notes TEXT
      `);
            const numericPatientId = parseInt(patient_id);
            if (notes !== undefined && !medical_history_id && !medical_history_option_id) {
                const updateResult = await this.pool.query('UPDATE patient_medical_history SET notes = $1 WHERE patient_id = $2', [notes, numericPatientId]);
                if (updateResult.rowCount === 0) {
                    const userId = user?.sub || user?.id || user?.userId;
                    const location_id = await this.getUserLocationId(userId);
                    await this.pool.query(`INSERT INTO patient_medical_history
      (patient_id, medical_history_id, medical_history_option_id, category_title, option_title, notes)
    VALUES($1, $2, $3, $4, $5, $6)`, [numericPatientId, 1, 0, 'General Notes', 'Notes Placeholder', notes]);
                }
                return { success: true };
            }
            if (!patient_id || !medical_history_id || !medical_history_option_id) {
                throw new Error(`Missing required fields: patient_id = ${patient_id}, medical_history_id = ${medical_history_id}, medical_history_option_id = ${medical_history_option_id} `);
            }
            let numericMedicalHistoryId = medical_history_id;
            if (typeof medical_history_id === 'string' && isNaN(Number(medical_history_id))) {
                const medicalHistoryResult = await this.pool.query('SELECT id FROM medical_history WHERE title ILIKE $1', [medical_history_id]);
                if (medicalHistoryResult.rows.length > 0) {
                    numericMedicalHistoryId = medicalHistoryResult.rows[0].id;
                }
                else {
                    numericMedicalHistoryId = 1;
                }
            }
            const userId = user?.sub || user?.id || user?.userId;
            const location_id = await this.getUserLocationId(userId);
            const existingRecord = await this.pool.query('SELECT id FROM patient_medical_history WHERE patient_id = $1 AND medical_history_option_id = $2', [numericPatientId, medical_history_option_id]);
            if (existingRecord.rows.length > 0) {
                return { message: 'Record already exists' };
            }
            let finalNotes = notes;
            if (finalNotes === undefined || finalNotes === null || finalNotes === '') {
                const existingNoteResult = await this.pool.query('SELECT notes FROM patient_medical_history WHERE patient_id = $1 AND notes IS NOT NULL AND notes != \'\' LIMIT 1', [numericPatientId]);
                if (existingNoteResult.rows.length > 0) {
                    finalNotes = existingNoteResult.rows[0].notes;
                }
            }
            const result = await this.pool.query('INSERT INTO patient_medical_history (patient_id, medical_history_id, medical_history_option_id, category_title, option_title, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [numericPatientId, numericMedicalHistoryId, medical_history_option_id, category_title, option_title, finalNotes]);
            return { success: true, id: result.rows[0].id };
        }
        catch (error) {
            console.error('Detailed error in savePatientMedicalHistory:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw new Error(`Failed to save medical history: ${error.message} `);
        }
    }
    async getPatientMedicalHistory(patientId, user) {
        try {
            const numericPatientId = parseInt(patientId);
            const location_id = user?.primary_location_id || user?.location_id || 1;
            await this.pool.query(`
        ALTER TABLE patient_medical_history 
        ADD COLUMN IF NOT EXISTS notes TEXT
      `);
            const result = await this.pool.query(`SELECT pmh.*,
      COALESCE(mh.title, pmh.category_title) as medical_history_title,
      COALESCE(mho.title, pmh.option_title) as option_title 
         FROM patient_medical_history pmh
         LEFT JOIN medical_history mh ON pmh.medical_history_id = mh.id
         LEFT JOIN medical_history_options mho ON pmh.medical_history_option_id = mho.id
         WHERE pmh.patient_id = $1
         ORDER BY COALESCE(mh.title, pmh.category_title), COALESCE(mho.title, pmh.option_title)`, [numericPatientId]);
            const groupedHistory = result.rows.reduce((acc, row) => {
                const category = row.medical_history_title;
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push({
                    id: row.id,
                    option_id: row.medical_history_option_id,
                    option_title: row.option_title
                });
                return acc;
            }, {});
            return {
                data: groupedHistory,
                notes: result.rows.find(row => row.notes)?.notes || ''
            };
        }
        catch (error) {
            console.error('Error getting patient medical history:', error);
            throw new Error('Failed to fetch patient medical history');
        }
    }
    async deletePatientMedicalHistory(data, user) {
        try {
            const { patient_id, medical_history_option_id } = data;
            const numericPatientId = parseInt(patient_id);
            await this.pool.query('DELETE FROM patient_medical_history WHERE patient_id = $1 AND medical_history_option_id = $2', [numericPatientId, medical_history_option_id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete medical history');
        }
    }
};
exports.MedicalHistoryService = MedicalHistoryService;
exports.MedicalHistoryService = MedicalHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MedicalHistoryService);
//# sourceMappingURL=medical-history.service.js.map