import { ActionOptions, IntegrityItem, IntegrityItemType, MOVED_POSITION } from '@data';
import { ACTION_TYPE, ParentItemHandler } from '../../../src/service/parent-item-handler';

const items: IntegrityItem[] = [{
    'id': '6348',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6347',
    'category': 'Heading',
    'primarySection': '1',
    'secondarySection': '1',
    'text': '<!-- MKS HTML --><h1>Introduction</h1>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '1',
}, {
    'id': '6355',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6348',
    'category': 'Heading',
    'primarySection': '1.1',
    'secondarySection': '1.1',
    'text': '<!-- MKS HTML --><h2>Background</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '1.1',
}, {
    'id': '6356',
    'oldId': null,
    'secondaryId': '6406',
    'parentId': '6348',
    'category': 'Heading',
    'primarySection': '1.2',
    'secondarySection': '2.2',
    'text': '<!-- MKS HTML --><h2>Project Goals</h2>',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.OLD,
    'changedAttachments': [],
    'section': '1.2',
}, {
    'id': '6383',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6356',
    'category': 'Comment',
    'primarySection': '1.2.1',
    'secondarySection': null,
    'text': '<!-- MKS HTML -->Any reasonable goal must be measurable',
    'type': IntegrityItemType.DELETE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '1.2.1',
}, {
    'id': '6349',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6347',
    'category': 'Heading',
    'primarySection': '2',
    'secondarySection': '2',
    'text': '<!-- MKS HTML --><h2>Constraints</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '2',
}, {
    'id': '6358',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6349',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': '2.1',
    'text': '<!-- MKS HTML -->This specifies constraints ',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '2.1',
}, {
    'id': '6356',
    'oldId': null,
    'secondaryId': '6406',
    'parentId': '6348',
    'category': 'Heading',
    'primarySection': '1.2',
    'secondarySection': '2.2',
    'text': '<!-- MKS HTML --><h2>Project Goals</h2>',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.NEW,
    'changedAttachments': [],
    'section': '2.2',
}, {
    'id': '6350',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6347',
    'category': 'Heading',
    'primarySection': '3',
    'secondarySection': '3',
    'text': '<!-- MKS HTML --><h2>Definitions</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '3',
}];

test('ACCEPT_MOVED_ITEM_WITH_DELETED_ITEM', () => {

    /*
     * 1.2 - Parent - (moved old Position)
     *   1.2.1 - Child - (deleted)
     * ...
     *  2.2 - Parent - (moved new Position)
     * Expected:
     *  1.2 => accept (move to 2.2)
     *  1.2.1 => accept
     * */

    const expectedResult: ActionOptions[] = [
        {
            item: items[6],
            action: ACTION_TYPE.ACCEPT,
            order: 1,
            parentInTheNewPosition: items[4].id,
            insertLocation: 'after:6358',
        },
        {
            item: items[3],
            action: ACTION_TYPE.ACCEPT,
            order: 2,
            parentInTheNewPosition: null,
            insertLocation: null,
        },
    ];

    const documentId = '#documentId';

    expect(new ParentItemHandler(items, documentId).handleOptions(items[6], ACTION_TYPE.ACCEPT)).toStrictEqual(expectedResult);
});


test('DECLINE_MOVED_ITEM_WITH_DELETED_ITEM', () => {

    /*
     * 1.2 - Parent - (moved old Position)
     *   1.2.1 - Child - (deleted)
     * ...
     *  2.2 - Parent - (moved new Position)
     * Expected:
     *  1.2 => decline
     * */

    const expectedResult: ActionOptions[] = [
        {
            item: items[6],
            action: ACTION_TYPE.DECLINE,
            order: 1,
            parentInTheNewPosition: null,
            insertLocation: null,
        },
    ];

    const documentId = '#documentId';

    expect(new ParentItemHandler(items, documentId).handleOptions(items[6], ACTION_TYPE.DECLINE)).toStrictEqual(expectedResult);
});
