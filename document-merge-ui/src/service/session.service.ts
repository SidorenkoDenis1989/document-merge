import { inject, injectable } from 'inversify';
import { INIT_USER_INFO, ROUTES, TYPES, UserAuthority, UserInfo, UserRole } from '@data';
import { ApplicationInfoScope, UserInfoScope } from '@scope';
import type { ENDPOINT_TYPE } from '@data';

export interface SessionService {
    getCurrentUserInfo(): Promise<UserInfo>;
    login(username: string, password: string, hostId?: string | number): Promise<UserAuthority[]>;
    logout(hostId?: string | number): Promise<any>;
    isAdmin(): Promise<boolean>;
}

@injectable()
export class SessionServiceImpl implements SessionService {
    constructor(
        @inject(TYPES.ENDPOINTS) private ENDPOINTS: ENDPOINT_TYPE,
        @inject(TYPES.APPLICATION_INFO_SCOPE) private applicationInfoScope: ApplicationInfoScope,
        @inject(TYPES.USER_INFO_SCOPE) private userInfoScope: UserInfoScope
    ) {}

    getCurrentUserInfo(): Promise<UserInfo> {
        const { currentUserInfo } = this.userInfoScope;
        if (currentUserInfo.userName) {
            return Promise.resolve(currentUserInfo);
        }
        return this.ENDPOINTS.AUTH.GET_CURRENT_USER_INFO()
            .then((userInfo) => {
                this.userInfoScope.currentUserInfo = userInfo;
                return userInfo;
            })
            .catch(() => {
                this.userInfoScope.currentUserInfo = INIT_USER_INFO;
                return INIT_USER_INFO;
            });
    }

    login(username: string, password: string, hostId: string | number): Promise<UserAuthority[]> {
        return this.ENDPOINTS.AUTH.REQUEST_USER(username, password, hostId).then((userAuthorities) => {
            this.userInfoScope.currentUserInfo = {
                ...this.userInfoScope.currentUserInfo,
                userAuthorities: userAuthorities,
            };
            return userAuthorities;
        });
    }

    logout(hostId: string | number): Promise<any> {
        window.location.hash = ROUTES.HOME.path;
        return this.ENDPOINTS.AUTH.REVOKE_USER(hostId).then(() => {
            this.userInfoScope.currentUserInfo = INIT_USER_INFO;
        });
    }

    isAdmin(): Promise<boolean> {
        return this.getCurrentUserInfo().then((userInfo) => {
            return userInfo.userAuthorities.some((authority) => authority.authority === UserRole.ADMIN);
        });
    }
}
