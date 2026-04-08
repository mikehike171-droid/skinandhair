export declare class Menu {
    id: number;
    title: string;
    code: string;
    href: string;
    icon: string;
    sort_order: number;
    parent_id: number;
    parent: Menu;
    children: Menu[];
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
