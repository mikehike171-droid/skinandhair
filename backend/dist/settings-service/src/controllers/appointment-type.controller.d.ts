import { AppointmentTypeService } from '../services/appointment-type.service';
import { AppointmentType } from '../entities/appointment-type.entity';
export declare class AppointmentTypeController {
    private readonly appointmentTypeService;
    constructor(appointmentTypeService: AppointmentTypeService);
    findAll(locationId?: string): Promise<AppointmentType[]>;
    findOne(id: string): Promise<AppointmentType>;
    create(appointmentTypeData: Partial<AppointmentType>): Promise<AppointmentType>;
    update(id: string, appointmentTypeData: Partial<AppointmentType>): Promise<AppointmentType>;
    delete(id: string): Promise<void>;
}
