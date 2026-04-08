import { Repository } from 'typeorm';
import { Holiday } from '../entities/holiday.entity';
export declare class HolidaysService {
    private holidayRepository;
    constructor(holidayRepository: Repository<Holiday>);
    findAll(locationId?: number): Promise<Holiday[]>;
    findOne(id: number): Promise<Holiday>;
    create(createHolidayDto: any): Promise<Holiday[]>;
    update(id: number, updateHolidayDto: any): Promise<Holiday>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
