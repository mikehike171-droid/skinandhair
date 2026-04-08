export declare class UpdateSystemSettingsDto {
    general?: {
        hospital_name?: string;
        hospital_heading?: string;
        hospital_logo?: string;
        timezone?: string;
        currency?: string;
        dateFormat?: string;
    };
    security?: {
        passwordMinLength?: number;
        requireUppercase?: boolean;
        requireNumbers?: boolean;
        requireSymbols?: boolean;
        sessionTimeout?: number;
        maxLoginAttempts?: number;
        enable2FA?: boolean;
    };
    notifications?: {
        emailEnabled?: boolean;
        smsEnabled?: boolean;
        pushEnabled?: boolean;
        emailFrom?: string;
    };
    system?: {
        maintenanceMode?: boolean;
        backupFrequency?: string;
        maxFileUploadSize?: number;
        enableAuditLogs?: boolean;
    };
}
export declare class SystemSettingDto {
    key: string;
    value: string;
    category?: string;
    description?: string;
}
