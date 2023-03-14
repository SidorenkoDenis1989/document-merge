import {ActionOptions, IntegrityItem, IntegrityItemType, MOVED_POSITION} from '@data';
import {ACTION_TYPE, ParentItemHandler} from '../../../src/service/parent-item-handler';
import {MultipleActionHandlerUtil} from '@utils';

const items: IntegrityItem[] = [{
    'id': '6188',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6187',
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
    'id': '6195',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6188',
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
    'id': '6255',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6251',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '1.2',
    'text': '<!-- MKS HTML --><p>Added Item</p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '1.2',
}, {
    'id': '6257',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6255',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '1.2.1',
    'text': '<!-- MKS HTML --><p>Added subsection</p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '1.2.1',
}, {
    'id': '6203',
    'oldId': null,
    'secondaryId': '6250',
    'parentId': '6191',
    'category': 'User Requirement',
    'primarySection': '4.2',
    'secondarySection': '1.2.2',
    'text': '<!-- MKS HTML -->Use Case 001',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.NEW,
    'changedAttachments': [],
    'section': '1.2.2',
},{
    'id': '6204',
    'oldId': null,
    'secondaryId': '6253',
    'parentId': '6191',
    'category': 'User Requirement',
    'primarySection': '4.3',
    'secondarySection': '1.2.3',
    'text': '<!-- MKS HTML -->Use Case 003',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.NEW,
    'changedAttachments': [],
    'section': '1.2.3',
},{
    'id': '6191',
    'oldId': null,
    'secondaryId': '6254',
    'parentId': '6187',
    'category': 'Heading',
    'primarySection': '4',
    'secondarySection': '1.3',
    'text': '<!-- MKS HTML --><h2>Use Cases</h2>',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.NEW,
    'changedAttachments': [],
    'section': '1.3',
}, {
    'id': '6202',
    'oldId': null,
    'secondaryId': '6249',
    'parentId': '6191',
    'category': 'Comment',
    'primarySection': '4.1',
    'secondarySection': '1.3.1',
    'text': '<!-- MKS HTML -->A use case diagram ',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.NEW,
    'changedAttachments': [],
    'section': '1.3.1',
}, {
    'id': '6189',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6187',
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
    'id': '6198',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6189',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': '2.1',
    'text': '<!-- MKS HTML -->This specifies constraints',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '2.1',
}, {
    'id': '6190',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6187',
    'category': 'Heading',
    'primarySection': '3',
    'secondarySection': '3',
    'text': '<!-- MKS HTML --><h2>Definitions</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '3',
}, {
    'id': '6200',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6190',
    'category': 'Comment',
    'primarySection': '3.1',
    'secondarySection': '3.1',
    'text': '<!-- MKS HTML -->Names are very important.',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '3.1',
}, {
    'id': '6192',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6187',
    'category': 'Heading',
    'primarySection': '5',
    'secondarySection': '4',
    'text': '<!-- MKS HTML --><h2>System Requirements</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '4',
}, {
    'id': '6191',
    'oldId': null,
    'secondaryId': '6254',
    'parentId': '6187',
    'category': 'Heading',
    'primarySection': '4',
    'secondarySection': '1.3',
    'text': '<!-- MKS HTML --><h2>Use Cases</h2>',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.OLD,
    'changedAttachments': [],
    'section': '4',
}, {
    'id': '6202',
    'oldId': null,
    'secondaryId': '6249',
    'parentId': '6191',
    'category': 'Comment',
    'primarySection': '4.1',
    'secondarySection': '1.3.1',
    'text': '<!-- MKS HTML -->A use case diagram identifies',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.OLD,
    'changedAttachments': [],
    'section': '4.1',
}, {
    'id': '6203',
    'oldId': null,
    'secondaryId': '6250',
    'parentId': '6191',
    'category': 'User Requirement',
    'primarySection': '4.2',
    'secondarySection': '1.2.2',
    'text': '<!-- MKS HTML -->Use Case 001',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.OLD,
    'changedAttachments': [],
    'section': '4.2',
}, {
    'id': '6204',
    'oldId': null,
    'secondaryId': '6253',
    'parentId': '6191',
    'category': 'User Requirement',
    'primarySection': '4.3',
    'secondarySection': '1.2.3',
    'text': '<!-- MKS HTML -->Use Case 003',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': MOVED_POSITION.OLD,
    'changedAttachments': [],
    'section': '4.3',
}];

const documentId = '#documentId';

const expectedResultOptions: ActionOptions[] = [
    {
        item: items[2],
        action: ACTION_TYPE.DECLINE,
        order: 1,
        parentInTheNewPosition: null,
        insertLocation: null
    },
    {
        item: items[3],
        action: ACTION_TYPE.DECLINE,
        order: 2,
        parentInTheNewPosition: null,
        insertLocation: null
    },
    {
        item: {...items[15], section: '1.3.2', secondarySection: '1.3.2'},
        action: ACTION_TYPE.UPDATE,
        order: 3,
        parentInTheNewPosition: null,
        insertLocation: null
    },
    {
        item: {...items[16], section: '1.3.3', secondarySection: '1.3.3'},
        action: ACTION_TYPE.UPDATE,
        order: 4,
        parentInTheNewPosition: null,
        insertLocation: null
    },
];

test('DECLINE_ADDED_PARENT', () => {
    /*
    * 1.2 (added)
    *   1.2.1(added)
    *   1.2.2  - Child 2 - (moved new Position)
    *   1.2.3  - Child 3 - (moved new Position)
    * 1.3 - Parent - (moved new Position)
    *  1.3.1  - Child 1 - (moved new Position)
    *...
    * 4. -Parent - (moved old Position)
    *   4.1 - Child 1 - (moved old Position)
    *   4.2 - Child 2 - (moved old Position)
    *   4.3 - Child 3 - (moved old Position)
    * Expected:
    *   1.2 => decline
    *   1.2.1 => decline
    *   1.2.2 => 1.3.2 (new position)
    *   1.2.3 => 1.3.3 (new position)
    * */


    expect(new ParentItemHandler(items, documentId).handleOptions(items[2], ACTION_TYPE.DECLINE)).toStrictEqual(expectedResultOptions);
});


test('MultipleActionHandlerUtil_TEST_UPDATE', () => {
    const result = [
        items[0],
        items[1],
        { ...items[4], section: '1.3.2', secondarySection: '1.3.2' },
        { ...items[5], section: '1.3.3', secondarySection: '1.3.3' },
        items[6],
        items[7],
        items[8],
        items[9],
        items[10],
        items[11],
        items[12],
        items[13],
        items[14],
        { ...items[15],  secondarySection: '1.3.2' },
        { ...items[16],  secondarySection: '1.3.3' },
    ];
    expect(new MultipleActionHandlerUtil(items).handle(expectedResultOptions)).toStrictEqual(result);
});
