export enum Role {
    USER,
    ADMIN
}

export interface User {
    id: string;
    username: string;
    email: string;
    created_at: Date;
    suspended_at: Date;
    role: Role;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}