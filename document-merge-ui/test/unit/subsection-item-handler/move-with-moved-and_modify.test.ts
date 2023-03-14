import { ActionOptions, IntegrityItem, IntegrityItemType, MOVED_POSITION } from '@data';
import { ACTION_TYPE, ParentItemHandler } from '../../../src/service/parent-item-handler';
import { MultipleActionHandlerUtil } from '@utils';

const items: IntegrityItem[] = [{
    'id': '6576',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6575',
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
    'id': '6578',
    'oldId': null,
    'secondaryId': '6635',
    'parentId': '6575',
    'category': 'Heading',
    'primarySection': '3',
    'secondarySection': '1.1',
    'text': '<!-- MKS HTML --><h2>Definitions1</h2>',
    'type': IntegrityItemType.MOVED_AND_MODIFY,
    'changedFields': {
        'Text': {
            'oldValue': '<!-- MKS HTML --><h2>Definitions</h2>',
            'newValue': '<!-- MKS HTML --><h2>Definitions1</h2>',
        },
    },
    'movedPosition': MOVED_POSITION.NEW,
    'changedAttachments': [],
    'section': '1.1',
}, {
    'id': '6588',
    'oldId': null,
    'secondaryId': '6636',
    'parentId': '6578',
    'category': 'Comment',
    'primarySection': '3.1',
    'secondarySection': '1.1.1',
    'text': '<!-- MKS HTML --><p>1</p>',
    'type': IntegrityItemType.MOVED_AND_MODIFY,
    'changedFields': {
        'Text': {
            'oldValue': '<!-- MKS HTML -->Names are very important.',
            'newValue': '<!-- MKS HTML --><p>1</p>',
        },
    },
    'movedPosition': MOVED_POSITION.NEW,
    'changedAttachments': [],
    'section': '1.1.1',
}, {
    'id': '6577',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6575',
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
    'id': '6578',
    'oldId': null,
    'secondaryId': '6635',
    'parentId': '6575',
    'category': 'Heading',
    'primarySection': '3',
    'secondarySection': '1.1',
    'text': '<!-- MKS HTML --><h2>Definitions1</h2>',
    'type': IntegrityItemType.MOVED_AND_MODIFY,
    'changedFields': {
        'Text': {
            'oldValue': '<!-- MKS HTML --><h2>Definitions</h2>',
            'newValue': '<!-- MKS HTML --><h2>Definitions1</h2>',
        },
    },
    'movedPosition': MOVED_POSITION.OLD,
    'changedAttachments': [],
    'section': '3',
}, {
    'id': '6588',
    'oldId': null,
    'secondaryId': '6636',
    'parentId': '6578',
    'category': 'Comment',
    'primarySection': '3.1',
    'secondarySection': '1.1.1',
    'text': '<!-- MKS HTML --><p>1</p>',
    'type': IntegrityItemType.MOVED_AND_MODIFY,
    'changedFields': {
        'Text': {
            'oldValue': '<!-- MKS HTML -->Names are very important.',
            'newValue': '<!-- MKS HTML --><p>1</p>',
        },
    },
    'movedPosition': MOVED_POSITION.OLD,
    'changedAttachments': [],
    'section': '3.1',
}];

const documentId = '#documentId';

const expectedDeclineResultOptions: ActionOptions[] = [
    {
        item: items[4],
        action: ACTION_TYPE.DECLINE,
        order: 1,
        parentInTheNewPosition: null,
        insertLocation: null,
    },
    {
        item: items[5],
        action: ACTION_TYPE.DECLINE,
        order: 2,
        parentInTheNewPosition: null,
        insertLocation: null,
    },
];

test('DECLINE_MOVED_AND_MODIFY_PARENT', () => {
    /*
    * 1.1  - Parent - (moved & modify new Position)
    *   1.1.1 - Child 1 - (moved & modify new Position)
    *...
    * 3  - Parent - (moved & modify old Position)
    *   3.1 - Child 1 - (moved & modify old Position)
    * Expected:
    *   3. => decline & modify
    *   3.1 => decline & modify
    * */

    expect(new ParentItemHandler(items, documentId).handleOptions(items[4], ACTION_TYPE.DECLINE)).toStrictEqual(expectedDeclineResultOptions);
});

test('MultipleActionHandlerUtil_TEST_DECLINE_MODIFY', () => {
    const result = [
        items[0],
        items[3],
        { ...items[4], type: IntegrityItemType.MODIFY, movedPosition: null },
        { ...items[5], type: IntegrityItemType.MODIFY, movedPosition: null },
    ];
    expect(new MultipleActionHandlerUtil(items).handle(expectedDeclineResultOptions)).toStrictEqual(result);
});


const expectedAcceptResultOptions: ActionOptions[] = [
    {
        item: items[1],
        action: ACTION_TYPE.ACCEPT,
        order: 1,
        parentInTheNewPosition: items[0].id,
        insertLocation: 'first',
    },
    {
        item: items[2],
        action: ACTION_TYPE.ACCEPT,
        order: 2,
        parentInTheNewPosition: items[1].id,
        insertLocation: 'first',
    },
];

test('ACCEPT_MOVED_AND_MODIFY_PARENT', () => {
    /*
    * 1.1  - Parent - (moved & modify new Position)
    *   1.1.1 - Child 1 - (moved & modify new Position)
    *...
    * 3  - Parent - (moved & modify old Position)
    *   3.1 - Child 1 - (moved & modify old Position)
    * Expected:
    *   1. => accept & modify
    *   1.1.1 => accept & modify
    * */

    expect(new ParentItemHandler(items, documentId).handleOptions(items[1], ACTION_TYPE.ACCEPT)).toStrictEqual(expectedAcceptResultOptions);
});


test('MultipleActionHandlerUtil_TEST_ACCEPT_MODIFY', () => {
    const result = [
        items[0],
        { ...items[1], primarySection: items[1].section, type: IntegrityItemType.MODIFY, movedPosition: null },
        { ...items[2], primarySection: items[2].section, type: IntegrityItemType.MODIFY, movedPosition: null },
        items[3],
    ];
    expect(new MultipleActionHandlerUtil(items).handle(expectedAcceptResultOptions)).toStrictEqual(result);
});
