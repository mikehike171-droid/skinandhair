"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFileColumnToPatientExamination1710000000000 = void 0;
class AddFileColumnToPatientExamination1710000000000 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE patient_examination 
            ADD COLUMN IF NOT EXISTS file TEXT;
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE patient_examination 
            DROP COLUMN IF EXISTS file;
        `);
    }
}
exports.AddFileColumnToPatientExamination1710000000000 = AddFileColumnToPatientExamination1710000000000;
//# sourceMappingURL=AddFileColumnToPatientExamination.js.map