import { SalaryCalculationService } from '../services/salary-calculation.service';
export declare class SalaryCalculationController {
    private readonly salaryService;
    constructor(salaryService: SalaryCalculationService);
    calculateMonthlySalary(locationId: string, month: string, year: string): Promise<any[]>;
    calculateUserSalary(userId: string, locationId: string, month: string, year: string): Promise<{
        userId: number;
        userName: string;
        message: string;
        month?: undefined;
        year?: undefined;
        monthlySalary?: undefined;
        dailySalary?: undefined;
        totalDaysInMonth?: undefined;
        expectedWorkingDays?: undefined;
        totalWorkedDays?: undefined;
        totalWorkedHours?: undefined;
        approvedLeaveDays?: undefined;
        pendingLeaveDays?: undefined;
        absentDays?: undefined;
        holidayDays?: undefined;
        shortHours?: undefined;
        extraDaysWorked?: undefined;
        salaryAddition?: undefined;
        salaryDeduction?: undefined;
        finalSalary?: undefined;
    } | {
        userId: number;
        userName: string;
        month: number;
        year: number;
        monthlySalary: number;
        dailySalary: number;
        totalDaysInMonth: number;
        expectedWorkingDays: number;
        totalWorkedDays: number;
        totalWorkedHours: number;
        approvedLeaveDays: number;
        pendingLeaveDays: number;
        absentDays: number;
        holidayDays: number;
        shortHours: number;
        extraDaysWorked: number;
        salaryAddition: number;
        salaryDeduction: number;
        finalSalary: number;
        message?: undefined;
    }>;
}
