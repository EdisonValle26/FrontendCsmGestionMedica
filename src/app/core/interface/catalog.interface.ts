export interface Catalogs {
    id?: number;
    type_id: string;
    code: string;
    value: string;
    description: string;
    deleted_at?: string | null;
    status?: string;
}