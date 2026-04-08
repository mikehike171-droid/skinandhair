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
exports.PrescriptionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_location_service_1 = require("./user-location.service");
let PrescriptionService = class PrescriptionService {
    constructor(userLocationService, dataSource) {
        this.userLocationService = userLocationService;
        this.dataSource = dataSource;
    }
    async savePatientPrescriptions(data, user) {
        console.log('DEBUG: savePatientPrescriptions received:', data);
        try {
            const { patient_id, prescriptions, medicine_days, next_appointment_date, notes_to_pro, notes_to_pharmacy } = data;
            const userId = user?.sub || user?.id || user?.userId;
            const location_id = userId ? await this.userLocationService.getUserLocationId(userId) : 1;
            const created_by = userId;
            if (!location_id) {
                throw new Error('Location ID not found in user context');
            }
            await this.createTablesIfNotExist();
            if (data.id && data.medicine_id) {
                const numericId = parseInt(data.id.toString());
                const numericMedicineId = parseInt(data.medicine_id.toString());
                console.log('DEBUG: Updating prescription metadata for ID:', numericId);
                await this.dataSource.query(`UPDATE patient_prescriptions 
           SET medicine_days = $1, next_appointment_date = $2, 
               notes_to_pro = $3, notes_to_pharmacy = $4
           WHERE id = $5`, [medicine_days, next_appointment_date, notes_to_pro, notes_to_pharmacy, numericId]);
                const m = prescriptions[0];
                if (m) {
                    console.log('DEBUG: Updating medicine detailed for ID:', numericMedicineId);
                    await this.dataSource.query(`UPDATE prescription_medicines 
             SET medicine_type = $1, medicine = $2, potency = $3, dosage = $4, 
                 morning = $5, afternoon = $6, night = $7, notes = $8
             WHERE id = $9`, [
                        m.medicineType, m.medicine, m.potency, m.dosage,
                        m.morning, m.afternoon, m.night, m.notes, numericMedicineId
                    ]);
                }
                return { success: true, prescriptionId: numericId, medicineId: numericMedicineId };
            }
            console.log('DEBUG: Inserting new prescription for patient:', patient_id);
            const prescriptionResult = await this.dataSource.query(`INSERT INTO patient_prescriptions 
         (patient_id, location_id, medicine_days, next_appointment_date, 
          notes_to_pro, notes_to_pharmacy, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING id`, [parseInt(patient_id?.toString()), location_id, medicine_days, next_appointment_date, notes_to_pro, notes_to_pharmacy, created_by]);
            const prescriptionId = prescriptionResult[0].id;
            const medicineResults = [];
            for (const prescription of prescriptions) {
                const result = await this.dataSource.query(`INSERT INTO prescription_medicines 
           (patient_prescriptions_id, medicine_type, medicine, potency, dosage, 
            morning, afternoon, night, notes) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
           RETURNING id`, [
                    prescriptionId, prescription.medicineType, prescription.medicine,
                    prescription.potency, prescription.dosage, prescription.morning,
                    prescription.afternoon, prescription.night, prescription.notes
                ]);
                medicineResults.push(result[0].id);
            }
            return { success: true, prescriptionId, medicineIds: medicineResults };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to save prescriptions');
        }
    }
    async createTablesIfNotExist() {
        try {
            await this.dataSource.query(`
        CREATE TABLE IF NOT EXISTS patient_prescriptions (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER NOT NULL,
          location_id INTEGER NOT NULL,
          medicine_days INTEGER,
          next_appointment_date DATE,
          notes_to_pro TEXT,
          notes_to_pharmacy TEXT,
          created_by INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
            await this.dataSource.query(`
        CREATE TABLE IF NOT EXISTS prescription_medicines (
          id SERIAL PRIMARY KEY,
          patient_prescriptions_id INTEGER REFERENCES patient_prescriptions(id) ON DELETE CASCADE,
          medicine_type VARCHAR(255),
          medicine VARCHAR(255),
          potency VARCHAR(255),
          dosage VARCHAR(255),
          morning BOOLEAN DEFAULT FALSE,
          afternoon BOOLEAN DEFAULT FALSE,
          night BOOLEAN DEFAULT FALSE,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
        }
        catch (error) {
            console.error('Error creating tables:', error);
        }
    }
    async getPatientPrescriptions(patientId, user) {
        try {
            const numericPatientId = parseInt(patientId);
            const userId = user?.sub || user?.id || user?.userId;
            const locationId = userId ? await this.userLocationService.getUserLocationId(userId) : 1;
            const tableCheck = await this.dataSource.query(`SELECT EXISTS (
           SELECT FROM information_schema.tables 
           WHERE table_name = 'patient_prescriptions'
         )`);
            if (!tableCheck[0].exists) {
                return [];
            }
            const result = await this.dataSource.query(`SELECT pp.*, pp.id as prescription_id, pm.id as medicine_id, 
                pm.medicine_type, pm.medicine, pm.potency, pm.dosage,
                pm.morning, pm.afternoon, pm.night, pm.notes as medicine_notes
         FROM patient_prescriptions pp
         LEFT JOIN prescription_medicines pm ON pp.id = pm.patient_prescriptions_id
         WHERE pp.patient_id = $1 AND pp.location_id = $2
         ORDER BY pp.created_at DESC, pm.id`, [numericPatientId, locationId]);
            return result;
        }
        catch (error) {
            console.error('Error getting patient prescriptions:', error);
            return [];
        }
    }
    async deletePatientPrescription(id, user) {
        try {
            const userId = user?.sub || user?.id || user?.userId;
            const location_id = userId ? await this.userLocationService.getUserLocationId(userId) : 1;
            if (!location_id) {
                throw new Error('Location ID not found in user context');
            }
            const result = await this.dataSource.query('DELETE FROM patient_prescriptions WHERE id = $1 AND location_id = $2', [id, location_id]);
            return { success: true };
        }
        catch (error) {
            console.error('Database error:', error);
            throw new Error('Failed to delete prescription');
        }
    }
};
exports.PrescriptionService = PrescriptionService;
exports.PrescriptionService = PrescriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_location_service_1.UserLocationService,
        typeorm_1.DataSource])
], PrescriptionService);
//# sourceMappingURL=prescription.service.js.map