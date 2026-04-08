import { DietChartService } from '../services/diet-chart.service';
export declare class DietChartController {
    private readonly dietChartService;
    constructor(dietChartService: DietChartService);
    getPatientDietCharts(patientId: string, req: any): Promise<any>;
    savePatientDietCharts(data: any, req: any): Promise<{
        success: boolean;
        dietChartIds: any[];
    }>;
    deletePatientDietChart(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
