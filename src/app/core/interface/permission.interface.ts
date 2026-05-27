export interface Permission {
id: number;
name: string;
code: string;
}

export interface PermissionPayload {
role_id: number;
option_id: number;
permissions: number[];
}