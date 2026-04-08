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
exports.ConsultationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const consultation_entity_1 = require("../entities/consultation.entity");
const consultation_payment_entity_1 = require("../entities/consultation-payment.entity");
let ConsultationService = class ConsultationService {
    constructor(consultationRepository, consultationPaymentRepository, dataSource) {
        this.consultationRepository = consultationRepository;
        this.consultationPaymentRepository = consultationPaymentRepository;
        this.dataSource = dataSource;
    }
    async ensureTablesExist() {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS consultations (
          id SERIAL PRIMARY KEY,
          consultation_id VARCHAR UNIQUE NOT NULL,
          patient_id INTEGER NOT NULL,
          doctor_id INTEGER NOT NULL,
          consultation_fee DECIMAL(10,2) NOT NULL,
          location_id INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
            await queryRunner.query(`
        DO $$ BEGIN
          CREATE TYPE consultation_payment_type AS ENUM ('cash', 'card', 'upi');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
            await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS consultation_payments (
          id SERIAL PRIMARY KEY,
          consultation_id INTEGER NOT NULL,
          payment_type consultation_payment_type NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (consultation_id) REFERENCES consultations(id)
        )
      `);
        }
        finally {
            await queryRunner.release();
        }
    }
    async recordConsultation(consultationData, locationId) {
        await this.ensureTablesExist();
        let nextId = 1;
        try {
            const lastConsultation = await this.consultationRepository
                .createQueryBuilder('consultation')
                .where("consultation.consultation_id ~ '^CON[0-9]+$'")
                .orderBy("CAST(SUBSTRING(consultation.consultation_id FROM 4) AS INTEGER)", 'DESC')
                .getOne();
            nextId = lastConsultation
                ? parseInt(lastConsultation.consultation_id.substring(3)) + 1
                : 1;
        }
        catch (error) {
            nextId = 1;
        }
        const consultationId = `CON${String(nextId).padStart(4, '0')}`;
        const consultation = this.consultationRepository.create({
            consultation_id: consultationId,
            patient_id: consultationData.patientId,
            doctor_id: consultationData.doctorId,
            consultation_fee: consultationData.consultationFee,
            location_id: locationId,
        });
        const savedConsultation = await this.consultationRepository.save(consultation);
        if (consultationData.payments && consultationData.payments.length > 0) {
            const paymentEntries = consultationData.payments.map(payment => this.consultationPaymentRepository.create({
                consultation_id: savedConsultation.id,
                payment_type: payment.type,
                amount: parseFloat(payment.amount)
            }));
            await this.consultationPaymentRepository.save(paymentEntries);
        }
        return {
            message: 'Consultation fee recorded successfully',
            consultation: {
                id: savedConsultation.id,
                consultationId: savedConsultation.consultation_id,
                fee: savedConsultation.consultation_fee,
                payments: consultationData.payments
            }
        };
    }
};
exports.ConsultationService = ConsultationService;
exports.ConsultationService = ConsultationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(consultation_entity_1.Consultation)),
    __param(1, (0, typeorm_1.InjectRepository)(consultation_payment_entity_1.ConsultationPayment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ConsultationService);
//# sourceMappingURL=consultation.service.js.map