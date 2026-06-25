export interface DoctorSchedule {
    id: number;
    doctor_id: number;
    consultorio_id: number;
    schedule_date: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
    consultorio?: Consultorio;
    is_active: boolean;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    created_by: number;
    updated_by: number | null;
}

export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    specialty_id: number;
}

export interface Consultorio {
    id: number;
    name: string;
}