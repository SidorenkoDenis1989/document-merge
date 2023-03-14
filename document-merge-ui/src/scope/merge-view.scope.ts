import { injectable } from 'inversify';
import { Baseline, TYPES } from '@data';
import { scopeDecorator } from '@utils';
@scopeDecorator(TYPES.MERGE_VIEW_SCOPE)
@injectable()
export class MergeViewScope {
    isOpenMergeConditions = true;
    isReadOnly = false;
    isBranchDifference = false;
    focusedItemId = '';
    currentSecondaryBaseline: Baseline = null;
    isHideMergeHistory = false;
}
