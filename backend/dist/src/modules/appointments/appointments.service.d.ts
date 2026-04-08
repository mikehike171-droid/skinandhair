import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
export declare class AppointmentsService {
    private appointmentRepository;
    constructor(appointmentRepository: Repository<Appointment>);
    create(appointmentData: Partial<Appointment>): Promise<Appointment>;
    findAll(locationId: string): Promise<Appointment[]>;
    findOne(id: string): Promise<Appointment>;
    update(id: string, updateData: Partial<Appointment>): Promise<Appointment>;
    private generateAppointmentNumber;
}
