export enum UserRole {
    ADMIN = 'ROLE_ADMIN',
    USER = 'ROLE_USER',
}

export interface UserAuthority {
    authority: UserRole;
}

export class UserInfo {
    userName: string;
    userAuthorities: UserAuthority[];
}
