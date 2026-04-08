import { EmployeeExpensesService } from '../services/employee-expenses.service';
import { CreateExpenseDto, UpdateExpenseStatusDto } from '../dto/expense.dto';
import type { File } from 'multer';
export declare class EmployeeExpensesController {
    private readonly employeeExpensesService;
    constructor(employeeExpensesService: EmployeeExpensesService);
    updateExpenseStatus(id: string, updateStatusDto: UpdateExpenseStatusDto): Promise<any>;
    findAll(req: any, employeeId?: string): Promise<any[]>;
    getExpensesSummary(req: any, employeeId?: string): Promise<any[]>;
    findAllExpenses(fromDate?: string, toDate?: string, page?: string, limit?: string): Promise<any>;
    findApprovedExpensesByLocation(locationId?: string, status?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(req: any, createExpenseDto: CreateExpenseDto, file?: File): Promise<import("../entities/employee-expense.entity").EmployeeExpense>;
    remove(id: string, req: any): Promise<void>;
}
