export interface MedicalRecord {
    id: number;
    appointment_id: number;
    disease_id: number;
    diagnosis: string;
    treatment: string;
    observations: string;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    created_by: number;
    updated_by: number | null;
    appointments: {
        id: number;
        patient_id: number;
        doctor_id: number;
        specialty_id: number;
        appointment_date: string;
        appointment_time: string;
        duration_minutes: number;
        status_id: number;
        appointment_type_id: number;
        reason: string;
        notes: string;
        created_at: string;
        updated_at: string | null;
        deleted_at: string | null;
        created_by: number;
        updated_by: number | null;
    };
    catalogs: {
        id: number;
        type_id: number;
        code: string;
        value: string;
        description: string;
        is_active: boolean;
        order_number: number | null;
        created_at: string | null;
        updated_at: string | null;
        deleted_at: string | null;
        created_by: number | null;
        updated_by: number | null;
    };
}