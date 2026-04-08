import { Repository } from 'typeorm';
import { ExpenseCategory } from '../entities/expense-category.entity';
import { CreateExpenseCategoryDto } from '../dto/expense.dto';
export declare class ExpenseCategoriesService {
    private expenseCategoryRepository;
    constructor(expenseCategoryRepository: Repository<ExpenseCategory>);
    findAll(): Promise<ExpenseCategory[]>;
    findOne(id: number): Promise<ExpenseCategory>;
    create(createExpenseCategoryDto: CreateExpenseCategoryDto): Promise<ExpenseCategory>;
    update(id: number, updateData: Partial<ExpenseCategory>): Promise<ExpenseCategory>;
    remove(id: number): Promise<void>;
}
