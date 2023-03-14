import { DialogScope, ApplicationInfoScope, IntegrityScope, FilterScope, MergeViewScope, UserInfoScope } from '@scope';

export type RootState = {
    DialogScope: DialogScope;
    ApplicationInfoScope: ApplicationInfoScope;
    IntegrityScope: IntegrityScope;
    FilterScope: FilterScope;
    MergeViewScope: MergeViewScope;
    UserInfoScope: UserInfoScope;
};
