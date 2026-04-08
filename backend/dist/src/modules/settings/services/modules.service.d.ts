import { Repository } from 'typeorm';
import { Module } from '../entities/module.entity';
import { SubModule } from '../entities/sub-module.entity';
export declare class ModulesService {
    private moduleRepository;
    private subModuleRepository;
    constructor(moduleRepository: Repository<Module>, subModuleRepository: Repository<SubModule>);
    findAllModules(): Promise<Module[]>;
    findAllSubModules(): Promise<SubModule[]>;
    findModulesWithSubModules(): Promise<any[]>;
    private getDefaultModulesWithSubModules;
    createModule(moduleData: Partial<Module>): Promise<Module>;
    createSubModule(subModuleData: Partial<SubModule>): Promise<SubModule>;
    updateModule(id: number, moduleData: Partial<Module>): Promise<Module>;
    deleteModule(id: number): Promise<void>;
}
