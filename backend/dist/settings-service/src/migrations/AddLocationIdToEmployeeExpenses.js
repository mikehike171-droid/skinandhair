"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLocationIdToEmployeeExpenses1642600000000 = void 0;
const typeorm_1 = require("typeorm");
class AddLocationIdToEmployeeExpenses1642600000000 {
    async up(queryRunner) {
        await queryRunner.addColumn('employee_expenses', new typeorm_1.TableColumn({
            name: 'location_id',
            type: 'int',
            isNullable: false,
            default: 1
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('employee_expenses', 'location_id');
    }
}
exports.AddLocationIdToEmployeeExpenses1642600000000 = AddLocationIdToEmployeeExpenses1642600000000;
//# sourceMappingURL=AddLocationIdToEmployeeExpenses.js.map