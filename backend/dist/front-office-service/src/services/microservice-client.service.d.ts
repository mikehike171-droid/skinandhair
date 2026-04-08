import { ConfigService } from '@nestjs/config';
export declare class MicroserviceClientService {
    private configService;
    constructor(configService: ConfigService);
    private getServiceUrl;
    get(serviceName: string, endpoint: string, headers?: any): Promise<any>;
    post(serviceName: string, endpoint: string, data: any, headers?: any): Promise<any>;
    put(serviceName: string, endpoint: string, data: any, headers?: any): Promise<any>;
    delete(serviceName: string, endpoint: string, headers?: any): Promise<any>;
    createBill(billData: any, headers?: any): Promise<any>;
    getAppointments(patientId: number, headers?: any): Promise<any>;
    createAppointment(appointmentData: any, headers?: any): Promise<any>;
    getServices(locationId: number, headers?: any): Promise<any>;
    getPackages(locationId: number, headers?: any): Promise<any>;
}
