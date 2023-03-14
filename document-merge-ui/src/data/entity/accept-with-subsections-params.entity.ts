import { DifferenceOptions, IntegrityItem } from '@data';
import { ACTION_TYPE } from '@service/parent-item-handler';

export class ActionOptions {
    item: IntegrityItem;
    action: ACTION_TYPE;
    order: number;
    parentInTheNewPosition?: string;
    insertLocation?: string;
}

export class ActionWithSubsectionsParams {
    differenceOptions: DifferenceOptions;
    items: ActionOptions[];
}
