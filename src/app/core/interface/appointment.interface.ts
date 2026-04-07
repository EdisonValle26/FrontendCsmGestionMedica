export type AppointmentStatus = 'confirmada' | 'pendiente' | 'urgente';
export interface Appointment {
    id?: number;
    date?: string;
    time: string;
    patient: string;
    doctor: string;
    specialty: string;
    status: AppointmentStatus;
}