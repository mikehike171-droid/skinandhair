import { Repository } from 'typeorm';
import { AppointmentType } from '../entities/appointment-type.entity';
export declare class AppointmentTypeService {
    private appointmentTypeRepository;
    constructor(appointmentTypeRepository: Repository<AppointmentType>);
    findAll(locationId?: number): Promise<AppointmentType[]>;
    findOne(id: number): Promise<AppointmentType>;
    create(appointmentTypeData: Partial<AppointmentType>): Promise<AppointmentType>;
    update(id: number, appointmentTypeData: Partial<AppointmentType>): Promise<AppointmentType>;
    delete(id: number): Promise<void>;
}
