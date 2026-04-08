import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: Partial<Appointment>): Promise<Appointment>;
    findAll(locationId: string): Promise<Appointment[]>;
    findOne(id: string): Promise<Appointment>;
    update(id: string, updateAppointmentDto: Partial<Appointment>): Promise<Appointment>;
}
