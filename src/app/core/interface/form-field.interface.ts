export interface FormField {

    name: string;
    label: string;

    type:
    | 'text'
    | 'textarea'
    | 'date'
    | 'time'
    | 'select';

    required?: boolean;

    options?: {
        label: string;
        value: any;
    }[];

    placeholder?: string;

    disabled?: boolean;

    inputType?:
    | 'text'
    | 'number'
    | 'decimal'
    | 'email'
    | 'letters'
    | 'alphanumeric';

    minLength?: number;
    maxLength?: number;
}
