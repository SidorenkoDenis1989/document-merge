import { ActionOptions, IntegrityItem, IntegrityItemType, MOVED_POSITION } from '@data';
import { ACTION_TYPE, ParentItemHandler } from '../../../src/service/parent-item-handler';
import { MultipleActionHandlerUtil, SectionCalculator } from '@utils';

const items: IntegrityItem[] = [{
    'id': '6932',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6931',
    'category': 'Heading',
    'primarySection': '1',
    'secondarySection': '1',
    'text': '1',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '1',
}, {
    'id': '6940',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6932',
    'category': 'Heading',
    'primarySection': '1.1',
    'secondarySection': '1.1',
    'text': '1.1',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '1.1',
}, {
    'id': '6933',
    'oldId': null,
    'secondaryId': '6995',
    'parentId': '6931',
    'category': 'Heading',
    'primarySection': '2',
    'secondarySection': '3',
    'text': '2',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.OLD,
    'changedAttachments': [],
    'section': '2',
}, {
    'id': '6942',
    'oldId': null,
    'secondaryId': '6999',
    'parentId': '6933',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': '3.2',
    'text': '2.1',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.OLD,
    'changedAttachments': [],
    'section': '2.1',
}, {
    'id': '6934',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6931',
    'category': 'Heading',
    'primarySection': '3',
    'secondarySection': '2',
    'text': '2',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '2',
}, {
    'id': '6944',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6934',
    'category': 'Comment',
    'primarySection': '3.1',
    'secondarySection': '2.1',
    'text': '2.1',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '2.1',
}, {
    'id': '6933',
    'oldId': null,
    'secondaryId': '6995',
    'parentId': '6931',
    'category': 'Heading',
    'primarySection': '2',
    'secondarySection': '3',
    'text': '3',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.NEW,
    'changedAttachments': [],
    'section': '3',
}, {
    'id': '7000',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6995',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '3.1',
    'text': '3.1',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '3.1',
}, {
    'id': '6942',
    'oldId': null,
    'secondaryId': '6999',
    'parentId': '6933',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': '3.2',
    'text': '3.2',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.NEW,
    'changedAttachments': [],
    'section': '3.2',
}, {
    'id': '6935',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6931',
    'category': 'Heading',
    'primarySection': '4',
    'secondarySection': '4',
    'text': '4',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '4',
}, {
    'id': '6946',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6935',
    'category': 'Comment',
    'primarySection': '4.1',
    'secondarySection': '4.1',
    'text': '4.1',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '4.1',
}, {
    'id': '6947',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6935',
    'category': 'User Requirement',
    'primarySection': '4.2',
    'secondarySection': '4.2',
    'text': '4.2',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '4.2',
}];


const documentId = '#documentId';

const expectedParentItemHandlerResult: ActionOptions[] = [
    {
        item: items[6],
        action: ACTION_TYPE.ACCEPT,
        order: 1,
        parentInTheNewPosition: documentId,
        insertLocation: 'after:'+ items[4].id,
    },
    {
        item: items[8],
        action: ACTION_TYPE.ACCEPT,
        order: 2,
        parentInTheNewPosition: items[6].id,
        insertLocation: 'first',
    }

];

test('ACCEPT_ADDED_TO_MOVED_ITEM', () => {
    /*
    * 2. - Parent - moved old Position
    *   2.1 - Child - moved old Position
    * 3. - Parent - moved new Position
    *   3.1 added
    *   3.2 - Child - moved new Position
    * Expected:
    *   3 => accept
    *   3.2 => accept
    * */

    expect(new ParentItemHandler(items, documentId).handleOptions(items[6], ACTION_TYPE.ACCEPT))
        .toStrictEqual(expectedParentItemHandlerResult);
});

const expectedMultipleActionHandlerResult = [
    items[0],
    items[1],
    items[4],
    items[5],
    {...items[6], primarySection: items[6].section, type: IntegrityItemType.NONE, movedPosition: null }, // moved new
    items[7], // added
    {...items[8],  primarySection: items[8].section, type: IntegrityItemType.NONE, movedPosition: null }, // moved new
    items[9],
    items[10],
    items[11],
];

test('ACCEPT_ADDED_TO_MOVED_ITEM - check MultipleActionHandlerUtil', () => {
    expect(new MultipleActionHandlerUtil(items)
        .handle(expectedParentItemHandlerResult))
        .toStrictEqual(expectedMultipleActionHandlerResult);
});

test('ACCEPT_ADDED_TO_MOVED_ITEM - check Recalculate section', () => {
    expect(SectionCalculator.recalculate(expectedMultipleActionHandlerResult))
        .toStrictEqual(expectedMultipleActionHandlerResult);
});
