export interface User {
    id?: number
    identification?: string,
    document_type_id?: number,
    first_name: string,
    last_name: string,
    email: string,
    username?: string,
    password?: string,
    phone: string,
    address: string,
    birth_date: string,
    gender_id: number,
    nationality_id: number,
    rol_id?: number,
    license_number?: string
}