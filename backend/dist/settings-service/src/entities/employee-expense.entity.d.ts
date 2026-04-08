import { User } from './user.entity';
import { ExpenseCategory } from './expense-category.entity';
export declare enum ExpenseStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    PAID = "paid"
}
export declare class EmployeeExpense {
    id: number;
    employeeId: number;
    employee: User;
    locationId: number;
    expenseCategoryId: number;
    expenseCategory: ExpenseCategory;
    amount: number;
    description: string;
    expenseDate: Date;
    receipt: string;
    status: ExpenseStatus;
    approvedBy: number;
    approver: User;
    approvedAt: Date;
    rejectionReason: string;
    createdAt: Date;
    updatedAt: Date;
}
