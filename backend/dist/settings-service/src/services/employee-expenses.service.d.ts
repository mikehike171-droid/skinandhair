import { Repository } from 'typeorm';
import { EmployeeExpense } from '../entities/employee-expense.entity';
import { CreateExpenseDto, UpdateExpenseStatusDto } from '../dto/expense.dto';
export declare class EmployeeExpensesService {
    private employeeExpenseRepository;
    constructor(employeeExpenseRepository: Repository<EmployeeExpense>);
    findAllWithEmployees(fromDate?: string, toDate?: string, page?: number, limit?: number): Promise<any>;
    findApprovedExpensesByLocation(locationId?: number, status?: string): Promise<any[]>;
    findAll(employeeId?: number): Promise<any[]>;
    findOne(id: number): Promise<any>;
    getUserById(userId: number): Promise<any>;
    create(employeeId: number, createExpenseDto: CreateExpenseDto, locationId: number): Promise<EmployeeExpense>;
    updateStatus(id: number, updateStatusDto: UpdateExpenseStatusDto, approverId: number): Promise<any>;
    getExpensesSummary(employeeId?: number): Promise<any[]>;
    remove(id: number, employeeId: number): Promise<void>;
}
