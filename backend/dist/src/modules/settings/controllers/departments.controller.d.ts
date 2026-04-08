import { DepartmentsService } from '../services/departments.service';
import { Department } from '../entities/department.entity';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    create(createDepartmentDto: Partial<Department>): Promise<Department>;
    findAll(): Promise<Department[]>;
    getDepartmentsByLocation(body: {
        locationId: number;
    }): Promise<Department[]>;
    findOne(id: string): Promise<Department>;
    update(id: string, updateDepartmentDto: Partial<Department>): Promise<Department>;
    remove(id: string): Promise<void>;
}
