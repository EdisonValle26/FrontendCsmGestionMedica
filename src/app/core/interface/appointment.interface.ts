export interface Appointment {
    time: string;
    patient: string;
    specialty: string;
    doctor: string;
    status: 'confirmada' | 'pendiente' | 'urgente';
}