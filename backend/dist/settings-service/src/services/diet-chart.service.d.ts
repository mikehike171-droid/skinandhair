export declare class DietChartService {
    private pool;
    constructor();
    savePatientDietCharts(data: any, user: any): Promise<{
        success: boolean;
        dietChartIds: any[];
    }>;
    getPatientDietCharts(patientId: string, user: any): Promise<any>;
    deletePatientDietChart(id: number, user: any): Promise<{
        success: boolean;
    }>;
}
