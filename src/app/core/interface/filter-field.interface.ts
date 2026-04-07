export interface FilterField {
    name: string;
    label: string;
    type: 'text' | 'date' | 'select';
    options?: { label: string; value: any }[];
}