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
exports.PatientRegistrationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_entity_1 = require("../entities/patient.entity");
const location_entity_1 = require("../entities/location.entity");
const crypto = require("crypto");
let PatientRegistrationService = class PatientRegistrationService {
    constructor(patientRepository, locationRepository) {
        this.patientRepository = patientRepository;
        this.locationRepository = locationRepository;
    }
    async registerPatient(patientData, locationId, createdBy) {
        const { salutation, firstName, middleName, lastName, fatherSpouseName, gender, mobile, email, dateOfBirth, bloodGroup, maritalStatus, address1, district, state, country, pinCode, emergencyContact, medicalHistory, medicalConditions, fee, feeType, source, occupation, specialization, doctor, amount, password, refPatientId, employeeRefId } = patientData;
        const location = await this.locationRepository.findOne({ where: { id: locationId } });
        if (!location) {
            throw new Error('Location not found');
        }
        const locationCode = location.locationCode;
        const lastPatient = await this.patientRepository
            .createQueryBuilder('patient')
            .where(`patient.patient_id LIKE '${locationCode}%'`)
            .orderBy("CAST(SUBSTRING(patient.patient_id FROM LENGTH(:locationCode) + 1) AS INTEGER)", 'DESC')
            .setParameter('locationCode', locationCode)
            .getOne();
        const nextId = lastPatient
            ? parseInt(lastPatient.patient_id.substring(locationCode.length)) + 1
            : 1;
        const patientId = `${locationCode}${String(nextId).padStart(3, '0')}`;
        const patient = this.patientRepository.create({
            patient_id: patientId,
            location_id: locationId,
            created_by: createdBy,
            salutation,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            father_spouse_name: fatherSpouseName,
            gender: gender?.toLowerCase(),
            date_of_birth: dateOfBirth,
            blood_group: bloodGroup,
            marital_status: maritalStatus,
            mobile,
            email,
            emergency_contact: emergencyContact,
            address1,
            district: district || 'HYDERABAD',
            state: state || 'TELANGANA',
            country: country || 'INDIA',
            pin_code: pinCode,
            medical_history: medicalHistory,
            medical_conditions: medicalConditions,
            fee,
            fee_type: feeType,
            source,
            occupation,
            specialization,
            doctor,
            amount: amount ? parseFloat(amount) : null,
            password: password ? crypto.createHash('md5').update(password).digest('hex') : null,
            ref_patient_id: refPatientId,
            employee_ref_id: employeeRefId
        });
        const savedPatient = await this.patientRepository.save(patient);
        return {
            message: 'Patient registered successfully',
            patient: {
                id: savedPatient.id,
                patientId: savedPatient.patient_id,
                name: `${savedPatient.first_name} ${savedPatient.last_name}`,
                status: savedPatient.status
            }
        };
    }
    async updatePatient(patientId, patientData, locationId, updatedBy) {
        const patient = await this.patientRepository.findOne({
            where: { id: parseInt(patientId) }
        });
        if (!patient) {
            throw new Error('Patient not found');
        }
        const { salutation, firstName, middleName, lastName, fatherSpouseName, gender, mobile, email, dateOfBirth, bloodGroup, maritalStatus, address1, district, state, country, pinCode, emergencyContact, medicalHistory, medicalConditions, password } = patientData;
        patient.salutation = salutation || patient.salutation;
        patient.first_name = firstName || patient.first_name;
        patient.middle_name = middleName;
        patient.last_name = lastName || patient.last_name;
        patient.father_spouse_name = fatherSpouseName;
        patient.gender = gender?.toLowerCase() || patient.gender;
        patient.mobile = mobile || patient.mobile;
        patient.email = email;
        patient.date_of_birth = dateOfBirth || patient.date_of_birth;
        patient.blood_group = bloodGroup;
        patient.marital_status = maritalStatus;
        patient.address1 = address1 || patient.address1;
        patient.district = district || patient.district;
        patient.state = state || patient.state;
        patient.country = country || patient.country;
        patient.pin_code = pinCode;
        patient.emergency_contact = emergencyContact;
        patient.medical_history = medicalHistory;
        patient.medical_conditions = medicalConditions;
        if (password) {
            patient.password = crypto.createHash('md5').update(password).digest('hex');
        }
        const updatedPatient = await this.patientRepository.save(patient);
        return {
            message: 'Patient updated successfully',
            patient: {
                id: updatedPatient.id,
                patientId: updatedPatient.patient_id,
                name: `${updatedPatient.first_name} ${updatedPatient.last_name}`,
                status: updatedPatient.status
            }
        };
    }
};
exports.PatientRegistrationService = PatientRegistrationService;
exports.PatientRegistrationService = PatientRegistrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __param(1, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PatientRegistrationService);
//# sourceMappingURL=patient-registration.service.js.map