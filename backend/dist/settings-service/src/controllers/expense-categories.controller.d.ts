import { ExpenseCategoriesService } from '../services/expense-categories.service';
import { CreateExpenseCategoryDto } from '../dto/expense.dto';
export declare class ExpenseCategoriesController {
    private readonly expenseCategoriesService;
    constructor(expenseCategoriesService: ExpenseCategoriesService);
    findAll(): Promise<import("../entities/expense-category.entity").ExpenseCategory[]>;
    findOne(id: string): Promise<import("../entities/expense-category.entity").ExpenseCategory>;
    create(createExpenseCategoryDto: CreateExpenseCategoryDto): Promise<import("../entities/expense-category.entity").ExpenseCategory>;
    update(id: string, updateData: any): Promise<import("../entities/expense-category.entity").ExpenseCategory>;
    remove(id: string): Promise<void>;
}
