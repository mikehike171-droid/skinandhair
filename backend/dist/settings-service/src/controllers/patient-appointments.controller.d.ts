import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
export declare class PatientAppointmentsController {
    private appointmentRepository;
    constructor(appointmentRepository: Repository<Appointment>);
    getPatientAppointments(id: string): Promise<{
        success: boolean;
        appointments: any;
    }>;
}
