import { MicroserviceClientService } from '../services/microservice-client.service';
export declare class FrontOfficeController {
    private readonly microserviceClient;
    constructor(microserviceClient: MicroserviceClientService);
    getDashboard(locationId: number): Promise<{
        appointments: any;
        queueStats: any;
        todayDate: string;
        error?: undefined;
    } | {
        appointments: any[];
        queueStats: {};
        todayDate: string;
        error: string;
    }>;
    searchPatients(query: string, locationId: number): Promise<any>;
    getServices(locationId: number): Promise<{
        id: string;
        name: string;
        price: number;
        category: string;
    }[]>;
    getPackages(locationId: number): Promise<any>;
    createQuickAppointment(appointmentData: any): Promise<any>;
    getPatientHistory(patientId: number): Promise<{
        patient: {
            id: number;
            name: string;
        };
        appointments: any;
        bills: any;
    }>;
}
