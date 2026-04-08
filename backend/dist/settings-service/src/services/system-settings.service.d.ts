import { Repository } from 'typeorm';
import { SystemSetting } from '../entities/system-setting.entity';
import { UpdateSystemSettingsDto } from '../dto/system-settings.dto';
export declare class SystemSettingsService {
    private systemSettingRepository;
    constructor(systemSettingRepository: Repository<SystemSetting>);
    getAllSettings(): Promise<any>;
    updateSettings(updateDto: UpdateSystemSettingsDto): Promise<any>;
    private parseValue;
    getSettingByKey(key: string): Promise<any>;
    initializeDefaultSettings(): Promise<void>;
}
