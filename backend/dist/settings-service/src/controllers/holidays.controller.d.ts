import { HolidaysService } from '../services/holidays.service';
import { Holiday } from '../entities/holiday.entity';
export declare class HolidaysController {
    private readonly holidaysService;
    constructor(holidaysService: HolidaysService);
    findAll(locationId?: string): Promise<Holiday[]>;
    findOne(id: string): Promise<Holiday>;
    create(createHolidayDto: Partial<Holiday>): Promise<Holiday[]>;
    update(id: string, updateHolidayDto: Partial<Holiday>): Promise<Holiday>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
