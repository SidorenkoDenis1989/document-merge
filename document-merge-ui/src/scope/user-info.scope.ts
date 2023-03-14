import { injectable } from 'inversify';
import { INIT_USER_INFO, TYPES, UserAuthority, UserInfo } from '@data';
import { scopeDecorator } from '@utils';
@scopeDecorator(TYPES.USER_INFO_SCOPE)
@injectable()
export class UserInfoScope {
    currentUserInfo: UserInfo = INIT_USER_INFO;
}
