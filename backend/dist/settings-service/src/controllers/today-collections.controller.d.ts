import { TodayCollectionsService } from '../services/today-collections.service';
export declare class TodayCollectionsController {
    private readonly todayCollectionsService;
    constructor(todayCollectionsService: TodayCollectionsService);
    getTodayCollections(locationId?: string, fromDate?: string, toDate?: string): Promise<any[]>;
}
