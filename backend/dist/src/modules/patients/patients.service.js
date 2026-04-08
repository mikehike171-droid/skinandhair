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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_entity_1 = require("./entities/patient.entity");
let PatientsService = class PatientsService {
    constructor(patientRepository, dataSource) {
        this.patientRepository = patientRepository;
        this.dataSource = dataSource;
    }
    async create(patientData) {
        const patientId = await this.generatePatientId(patientData.locationId);
        const patient = this.patientRepository.create({
            ...patientData,
            patientId,
        });
        return this.patientRepository.save(patient);
    }
    async findAll(locationId, patientSourceId, fromDate, toDate) {
        let query = this.patientRepository.createQueryBuilder('patient')
            .where('patient.locationId = :locationId', { locationId: parseInt(locationId) });
        if (patientSourceId) {
            query = query.andWhere('patient.patientSourceId = :patientSourceId', { patientSourceId: parseInt(patientSourceId) });
        }
        if (fromDate) {
            query = query.andWhere('DATE(patient.createdAt) >= :fromDate', { fromDate });
        }
        if (toDate) {
            query = query.andWhere('DATE(patient.createdAt) <= :toDate', { toDate });
        }
        console.log('Query SQL:', query.getSql());
        console.log('Query Parameters:', { locationId, patientSourceId, fromDate, toDate });
        return query.orderBy('patient.createdAt', 'DESC').getMany();
    }
    async findOne(id) {
        return this.patientRepository.findOne({ where: { id: parseInt(id) } });
    }
    async update(id, updateData) {
        await this.patientRepository.update(parseInt(id), updateData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.patientRepository.delete(parseInt(id));
    }
    async generatePatientId(locationId) {
        const count = await this.patientRepository.count({ where: { locationId } });
        return `PAT${(count + 1).toString().padStart(6, '0')}`;
    }
    async registerPatient(registerData, locationId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const patientCount = await queryRunner.query('SELECT COUNT(*) as count FROM patients WHERE location_id = $1', [locationId]);
            const patientId = `PAT${(parseInt(patientCount[0].count) + 1).toString().padStart(6, '0')}`;
            const patientResult = await queryRunner.query(`
        INSERT INTO patients (patient_id, first_name, last_name, date_of_birth, gender, 
                            phone, email, address, emergency_contact, blood_group, 
                            allergies, medical_history, location_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id
      `, [
                patientId, registerData.patient.first_name, registerData.patient.last_name,
                registerData.patient.date_of_birth, registerData.patient.gender,
                registerData.patient.phone, registerData.patient.email,
                registerData.patient.address, registerData.patient.emergency_contact,
                registerData.patient.blood_group, registerData.patient.allergies,
                registerData.patient.medical_history, locationId
            ]);
            const newPatientId = patientResult[0].id;
            let consultationId = null;
            if (registerData.consultation) {
                const consultationCount = await queryRunner.query('SELECT COUNT(*) as count FROM consultations WHERE location_id = $1', [locationId]);
                const consultationNumber = `CON${(parseInt(consultationCount[0].count) + 1).toString().padStart(6, '0')}`;
                const consultationResult = await queryRunner.query(`
          INSERT INTO consultations (consultation_id, patient_id, doctor_id, 
                                   chief_complaint, diagnosis, treatment_plan, 
                                   consultation_fee, location_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id
        `, [
                    consultationNumber, newPatientId, registerData.consultation.doctor_id,
                    registerData.consultation.chief_complaint, registerData.consultation.diagnosis,
                    registerData.consultation.treatment_plan, registerData.consultation.consultation_fee,
                    locationId
                ]);
                consultationId = consultationResult[0].id;
            }
            if (registerData.bill) {
                const billCount = await queryRunner.query('SELECT COUNT(*) as count FROM bills WHERE location_id = $1', [locationId]);
                const billNumber = `BILL${(parseInt(billCount[0].count) + 1).toString().padStart(6, '0')}`;
                const billResult = await queryRunner.query(`
          INSERT INTO bills (bill_id, patient_id, consultation_id, total_amount, 
                           discount_amount, tax_amount, net_amount, payment_method, 
                           payment_status, location_id, created_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING id
        `, [
                    billNumber, newPatientId, consultationId, registerData.bill.total_amount,
                    registerData.bill.discount_amount || 0, registerData.bill.tax_amount || 0,
                    registerData.bill.net_amount, registerData.bill.payment_method,
                    registerData.bill.payment_status || 'completed', locationId,
                    registerData.bill.created_by
                ]);
                const billId = billResult[0].id;
                if (registerData.bill.items) {
                    for (const item of registerData.bill.items) {
                        await queryRunner.query(`
              INSERT INTO bill_items (bill_id, item_name, item_type, quantity, unit_price, total_price)
              VALUES ($1, $2, $3, $4, $5, $6)
            `, [billId, item.item_name, item.item_type || 'consultation',
                            item.quantity || 1, item.unit_price, item.total_price]);
                    }
                }
                if (registerData.bill.payment_method) {
                    const transactionNumber = `TXN${Date.now()}`;
                    await queryRunner.query(`
            INSERT INTO payment_transactions (transaction_id, bill_id, amount, 
                                           payment_method, payment_status, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [transactionNumber, billId, registerData.bill.net_amount,
                        registerData.bill.payment_method, 'completed', registerData.bill.created_by]);
                }
            }
            await queryRunner.commitTransaction();
            return {
                success: true,
                patient_id: patientId,
                message: 'Patient registered successfully'
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createConsultation(consultationData, locationId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const consultationCount = await queryRunner.query('SELECT COUNT(*) as count FROM consultations WHERE location_id = $1', [locationId]);
            const consultationNumber = `CON${(parseInt(consultationCount[0].count) + 1).toString().padStart(6, '0')}`;
            const result = await queryRunner.query(`
        INSERT INTO consultations (consultation_id, patient_id, doctor_id, 
                                 chief_complaint, diagnosis, treatment_plan, 
                                 consultation_fee, location_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
                consultationNumber, consultationData.patient_id, consultationData.doctor_id,
                consultationData.chief_complaint, consultationData.diagnosis,
                consultationData.treatment_plan, consultationData.consultation_fee, locationId
            ]);
            return { success: true, consultation: result[0] };
        }
        catch (error) {
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async createBill(billData, locationId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const billCount = await queryRunner.query('SELECT COUNT(*) as count FROM bills WHERE location_id = $1', [locationId]);
            const billNumber = `BILL${(parseInt(billCount[0].count) + 1).toString().padStart(6, '0')}`;
            const billResult = await queryRunner.query(`
        INSERT INTO bills (bill_id, patient_id, consultation_id, total_amount, 
                         net_amount, payment_method, payment_status, location_id, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `, [
                billNumber, billData.patient_id, billData.consultation_id,
                billData.total_amount, billData.net_amount, billData.payment_method,
                billData.payment_status || 'completed', locationId, billData.created_by
            ]);
            const billId = billResult[0].id;
            if (billData.items) {
                for (const item of billData.items) {
                    await queryRunner.query(`
            INSERT INTO bill_items (bill_id, item_name, unit_price, total_price)
            VALUES ($1, $2, $3, $4)
          `, [billId, item.item_name, item.unit_price, item.total_price]);
                }
            }
            await queryRunner.commitTransaction();
            return { success: true, bill_id: billNumber };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], PatientsService);
//# sourceMappingURL=patients.service.js.map