export interface TableColumn {
    label: string;
    field: string;
    type?: 'text' | 'badge' | 'date';
    format?: (value: any) => string;
}