export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'time';
    required?: boolean;
    options?: { label: string; value: any }[];
}