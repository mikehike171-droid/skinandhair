import { ExpenseStatus } from '../entities/employee-expense.entity';
export declare class CreateExpenseDto {
    expenseCategoryId: number;
    amount: number;
    description?: string;
    expenseDate: string;
    receipt?: string;
}
export declare class UpdateExpenseStatusDto {
    status: ExpenseStatus;
    rejectionReason?: string;
}
export declare class CreateExpenseCategoryDto {
    name: string;
    description?: string;
}
