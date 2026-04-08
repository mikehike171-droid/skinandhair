import { Module } from './module.entity';
export declare class SubModule {
    id: number;
    moduleId: number;
    module: Module;
    subcatName: string;
    subcatPath: string;
    icon: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
