import { Role } from './role.entity';
import { Menu } from './menu.entity';
export declare class RoleMenu {
    id: number;
    role_id: number;
    menu_id: number;
    role: Role;
    menu: Menu;
    created_at: Date;
}
