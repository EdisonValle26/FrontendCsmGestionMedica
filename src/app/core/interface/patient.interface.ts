export interface Patient {
    id?: number;
    identification: string;
    document_type_id: number;
    first_name: string;
    last_name: string;
    birth_date?: string;
    gender_id?: number;
    nationality_id?: number;
    phone?: string;
    email?: string;
    address?: string;
    medical_history?: string;
    patient?: string;
}
