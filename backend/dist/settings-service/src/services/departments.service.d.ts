import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
export declare class DepartmentsService {
    private departmentRepository;
    constructor(departmentRepository: Repository<Department>);
    findAll(): Promise<Department[]>;
    findOne(id: number): Promise<Department>;
    create(departmentData: Partial<Department>): Promise<Department>;
    update(id: number, departmentData: Partial<Department>): Promise<Department>;
    findByLocationId(locationId: number): Promise<Department[]>;
    remove(id: number): Promise<Department>;
}
