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
exports.DietChartService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let DietChartService = class DietChartService {
    constructor() {
        this.pool = new pg_1.Pool({
            host: '127.0.0.1',
            port: 5432,
            user: 'postgres',
            password: '12345',
            database: 'postgres',
        });
    }
    async savePatientDietCharts(data, user) {
        try {
            const { patient_id, diet_charts, notes } = data;
            const location_id = data.location_id || user?.primary_location_id || user?.location_id || user?.id;
            const created_by = user?.id || user?.user_id;
            if (!location_id) {
                throw new Error('Location ID not found in user context');
            }
            const results = [];
            for (const chart of diet_charts) {
                const result = await this.pool.query(`INSERT INTO patient_diet_charts 
           (patient_id, location_id, chart_no, chart_title, chart_title_specific, 
            start_date, end_date, notes, created_by) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
           RETURNING id`, [
                    patient_id, location_id, chart.chartNo, chart.chartTitle,
                    chart.chartTitleSpecific, chart.startDate || null, chart.endDate || null,
                    notes, created_by
                ]);
                results.push(result.rows[0].id);
            }
            return { success: true, dietChartIds: results };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to save diet charts');
        }
    }
    async getPatientDietCharts(patientId, user) {
        try {
            const numericPatientId = parseInt(patientId);
            const location_id = user?.primary_location_id || user?.location_id || 1;
            const result = await this.pool.query(`SELECT * FROM patient_diet_charts
         WHERE patient_id = $1 AND location_id = $2
         ORDER BY created_at DESC`, [numericPatientId, location_id]);
            return result.rows;
        }
        catch (error) {
            console.error('Error getting patient diet charts:', error);
            throw new Error('Failed to fetch patient diet charts');
        }
    }
    async deletePatientDietChart(id, user) {
        try {
            const location_id = user?.primary_location_id || user?.location_id || user?.id;
            if (!location_id) {
                throw new Error('Location ID not found in user context');
            }
            await this.pool.query('DELETE FROM patient_diet_charts WHERE id = $1 AND location_id = $2', [id, location_id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete diet chart');
        }
    }
};
exports.DietChartService = DietChartService;
exports.DietChartService = DietChartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DietChartService);
//# sourceMappingURL=diet-chart.service.js.map