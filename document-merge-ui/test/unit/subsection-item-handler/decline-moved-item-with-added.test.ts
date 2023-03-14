import { ActionOptions, IntegrityItem, IntegrityItemType, MOVED_POSITION } from '@data';
import { ACTION_TYPE, ParentItemHandler } from '../../../src/service/parent-item-handler';

const items: IntegrityItem[] = [{
    'id': '6413',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6412',
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
    'id': '6418',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6413',
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
    'id': '6414',
    'oldId': null,
    'secondaryId': '6441',
    'parentId': '6412',
    'category': 'Heading',
    'primarySection': '2',
    'secondarySection': '3.1',
    'text': '<!-- MKS HTML --><h2>Constraints</h2>',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.OLD,
    'changedAttachments': [],
    'section': '2',
}, {
    'id': '6420',
    'oldId': null,
    'secondaryId': '6438',
    'parentId': '6414',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': '3.1.1',
    'text': '<!-- MKS HTML -->This specifies constraints',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.OLD,
    'changedAttachments': [],
    'section': '2.1',
}, {
    'id': '6415',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6412',
    'category': 'Heading',
    'primarySection': '3',
    'secondarySection': '2',
    'text': '<!-- MKS HTML --><h2>Definitions</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '2',
}, {
    'id': '6422',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6415',
    'category': 'Comment',
    'primarySection': '3.1',
    'secondarySection': '2.1',
    'text': '<!-- MKS HTML -->Names are very important.',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '2.1',
}, {
    'id': '6416',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6412',
    'category': 'Heading',
    'primarySection': '4',
    'secondarySection': '3',
    'text': '<!-- MKS HTML --><h2>Use Cases</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '3',
}, {
    'id': '6414',
    'oldId': null,
    'secondaryId': '6441',
    'parentId': '6412',
    'category': 'Heading',
    'primarySection': '2',
    'secondarySection': '3.1',
    'text': '<!-- MKS HTML --><h2>Constraints</h2>',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.NEW,
    'changedAttachments': [],
    'section': '3.1',
}, {
    'id': '6420',
    'oldId': null,
    'secondaryId': '6438',
    'parentId': '6414',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': '3.1.1',
    'text': '<!-- MKS HTML -->This specifies constraints',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.NEW,
    'changedAttachments': [],
    'section': '3.1.1',
}, {
    'id': '6443',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6441',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '3.1.2',
    'text': '<!-- MKS HTML --><p>Added Item</p><p><br></p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '3.1.2',
}];

const documentId = '#documentId';

test('DECLINE_MOVED_PARENT_WITH_ADDED_CHILD', () => {
    /*
    * 2 - Parent - (moved old Position)
    *  2.1 - Child 1 - (moved old Position)
    *...
    * 3.1 -Parent - (moved new Position)
    *   3.1.1 - Child 1 - (moved new Position)
    *   3.1.2 added
    * Expected:
    *   3.1 => decline
    *   3.1.1 => decline
    *   3.1.2 => decline
    * */

    const expectedResult: ActionOptions[] = [
        {
            item: items[2],
            action: ACTION_TYPE.DECLINE,
            order: 1,
            parentInTheNewPosition: null,
            insertLocation: null,
        },
        {
            item: items[3],
            action: ACTION_TYPE.DECLINE,
            order: 2,
            parentInTheNewPosition: null,
            insertLocation: null,
        },
        {
            item: items[9],
            action: ACTION_TYPE.DECLINE,
            order: 3,
            parentInTheNewPosition: null,
            insertLocation: null,
        },

    ];


    expect(new ParentItemHandler(items, documentId).handleOptions(items[2], ACTION_TYPE.DECLINE)).toStrictEqual(expectedResult);
});

