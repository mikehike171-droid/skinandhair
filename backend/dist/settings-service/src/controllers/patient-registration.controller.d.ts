import { PatientRegistrationService } from '../services/patient-registration.service';
import { PatientListService } from '../services/patient-list.service';
import { UserLocationService } from '../services/user-location.service';
export declare class PatientRegistrationController {
    private readonly patientRegistrationService;
    private readonly patientListService;
    private readonly userLocationService;
    constructor(patientRegistrationService: PatientRegistrationService, patientListService: PatientListService, userLocationService: UserLocationService);
    getAllPatients(req: any, queryLocationId?: string, patientSourceId?: string, fromDate?: string, toDate?: string, search?: string, page?: string, limit?: string): Promise<import("../entities/patient.entity").Patient[] | {
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    searchPatients(req: any, searchQuery: string, queryLocationId?: string, page?: string, limit?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getRefPatients(req: any, queryLocationId?: string, page?: string, limit?: string): Promise<{
        data: import("../entities/patient.entity").Patient[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getEmployeeRefPatients(req: any, queryLocationId?: string, page?: string, limit?: string): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getPatientById(patientId: string, req: any, queryLocationId?: string): Promise<import("../entities/patient.entity").Patient>;
    registerPatient(req: any, patientData: any): Promise<{
        message: string;
        patient: {
            id: number;
            patientId: string;
            name: string;
            status: string;
        };
    }>;
    updatePatient(patientId: string, req: any, patientData: any): Promise<{
        message: string;
        patient: {
            id: number;
            patientId: string;
            name: string;
            status: string;
        };
    }>;
}
