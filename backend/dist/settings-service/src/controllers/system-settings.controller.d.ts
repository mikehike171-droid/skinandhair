import { SystemSettingsService } from '../services/system-settings.service';
import { UpdateSystemSettingsDto } from '../dto/system-settings.dto';
import type { File } from 'multer';
export declare class SystemSettingsController {
    private readonly systemSettingsService;
    constructor(systemSettingsService: SystemSettingsService);
    getSettings(): Promise<any>;
    updateSettings(updateDto: UpdateSystemSettingsDto): Promise<any>;
    initializeSettings(): Promise<{
        message: string;
    }>;
    uploadLogo(file: File): Promise<{
        logoUrl: string;
        message: string;
    }>;
}
