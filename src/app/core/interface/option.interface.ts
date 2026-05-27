import { Permission } from "./permission.interface";

export interface Option {
    id: number;
    name: string;
    route: string;
    icon: string;
    parent_id?: number | null;
    permissions?: Permission[];
}
