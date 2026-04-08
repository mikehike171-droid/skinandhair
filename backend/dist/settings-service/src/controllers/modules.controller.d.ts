import { ModulesService } from '../services/modules.service';
import { Module } from '../entities/module.entity';
import { SubModule } from '../entities/sub-module.entity';
export declare class ModulesController {
    private readonly modulesService;
    constructor(modulesService: ModulesService);
    findAllModules(includeSubModules?: string, locationId?: string): Promise<any[]>;
    findAllSubModules(): Promise<SubModule[]>;
    findModulesWithSubModules(): Promise<any[]>;
    createModule(createModuleDto: Partial<Module>): Promise<Module>;
    createSubModule(createSubModuleDto: Partial<SubModule>): Promise<SubModule>;
    updateModule(id: string, updateModuleDto: Partial<Module>): Promise<Module>;
    removeModule(id: string): Promise<void>;
}
