import { DepartmentsService } from '../services/departments.service';
import { Department } from '../entities/department.entity';
export declare class DepartmentsPublicController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    findOne(id: string): Promise<Department>;
    update(id: string, updateDepartmentDto: Partial<Department>): Promise<Department>;
}
