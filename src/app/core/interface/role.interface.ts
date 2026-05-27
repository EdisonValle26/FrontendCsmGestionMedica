import { Option } from "./option.interface";

export interface Role {
    id: number;
    name: string;
    description: string;
    deleted_at?: string | null;
    options?: Option[];
}

export interface ModulePermission {
    moduleId: number;
    moduleName: string;
    icon: string;
    permissions: {
        [roleId: number]: {
            read: boolean;
            create: boolean;
            update: boolean;
            delete: boolean;
        };
    };
}
