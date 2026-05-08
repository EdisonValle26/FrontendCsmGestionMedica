export interface UserOption {
    id: number;
    name: string;
    route: string;
    icon: string;
    permissions: string[];
}

export interface UserData {
    id: number;
    username: string;
    fullName: string;
    roles: string[];
    options: UserOption[];
}

export interface LoginResponse {
    access_token: string;
    user: UserData;
}