import { ActionOptions, IntegrityItem, IntegrityItemType, MOVED_POSITION } from '@data';
import { ACTION_TYPE, ParentItemHandler } from '../../../src/service/parent-item-handler';


test('ACCEPT_DELETED_PARENT_ITEM_WITH_MOVED_SUBSECTION', () => {

    /*
    * 2 - Child -(moved new position)
    * ...
    * 4 - Parent - (deleted)
    *   4.1 - Child - (moved old position)
    * Expected:
    *  4 => accept
    *  4.1 => accept (auto moving to 2)
    * */

    const items: IntegrityItem[] = [{
        'id': '6121',
        'oldId': null,
        'secondaryId': null,
        'parentId': '6120',
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
        'id': '6128',
        'oldId': null,
        'secondaryId': null,
        'parentId': '6121',
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
        'id': '6129',
        'oldId': null,
        'secondaryId': null,
        'parentId': '6121',
        'category': 'Heading',
        'primarySection': '1.2',
        'secondarySection': '1.2',
        'text': '<!-- MKS HTML --><h2>Project Goals</h2>',
        'type': IntegrityItemType.NONE,
        'changedFields': {},
        'movedPosition': null,
        'changedAttachments': [],
        'section': '1.2',
    }, {
        'id': '6133',
        'oldId': null,
        'secondaryId': '6181',
        'parentId': '6123',
        'category': 'Comment',
        'primarySection': '3.1',
        'secondarySection': '2',
        'text': '<!-- MKS HTML -->Names are very important.',
        'type': IntegrityItemType.MOVED,
        'changedFields': {},
        'movedPosition': MOVED_POSITION.NEW,
        'changedAttachments': [],
        'section': '2',
    }, {
        'id': '6122',
        'oldId': null,
        'secondaryId': null,
        'parentId': '6120',
        'category': 'Heading',
        'primarySection': '2',
        'secondarySection': '3',
        'text': '<!-- MKS HTML --><h2>Constraints</h2>',
        'type': IntegrityItemType.NONE,
        'changedFields': {},
        'movedPosition': null,
        'changedAttachments': [],
        'section': '3',
    }, {
        'id': '6131',
        'oldId': null,
        'secondaryId': null,
        'parentId': '6122',
        'category': 'Comment',
        'primarySection': '2.1',
        'secondarySection': '3.1',
        'text': '<!-- MKS HTML -->This specifies constraints ',
        'type': IntegrityItemType.NONE,
        'changedFields': {},
        'movedPosition': null,
        'changedAttachments': [],
        'section': '3.1',
    }, {
        'id': '6123',
        'oldId': null,
        'secondaryId': null,
        'parentId': '6120',
        'category': 'Heading',
        'primarySection': '3',
        'secondarySection': null,
        'text': '<!-- MKS HTML --><h2>Definitions</h2>',
        'type': IntegrityItemType.DELETE,
        'changedFields': {},
        'movedPosition': null,
        'changedAttachments': [],
        'section': '4',
    }, {
        'id': '6133',
        'oldId': null,
        'secondaryId': '6181',
        'parentId': '6123',
        'category': 'Comment',
        'primarySection': '3.1',
        'secondarySection': '2',
        'text': '<!-- MKS HTML -->Names are very important.',
        'type': IntegrityItemType.MOVED,
        'changedFields': {},
        'movedPosition': MOVED_POSITION.OLD,
        'changedAttachments': [],
        'section': '4.1',
    }, {
        'id': '6124',
        'oldId': null,
        'secondaryId': null,
        'parentId': '6120',
        'category': 'Heading',
        'primarySection': '4',
        'secondarySection': '4',
        'text': '<!-- MKS HTML --><h2>Use Cases</h2>',
        'type': IntegrityItemType.NONE,
        'changedFields': {},
        'movedPosition': null,
        'changedAttachments': [],
        'section': '4',
    }, {
        'id': '6135',
        'oldId': null,
        'secondaryId': null,
        'parentId': '6124',
        'category': 'Comment',
        'primarySection': '4.1',
        'secondarySection': '4.1',
        'text': '<!-- MKS HTML -->A use case diagram identifies',
        'type': IntegrityItemType.NONE,
        'changedFields': {},
        'movedPosition': null,
        'changedAttachments': [],
        'section': '4.1',
    }];

    const documentId = '#documentId';

    const expectedResult: ActionOptions[] = [
        {
            item: items[6],
            action: ACTION_TYPE.ACCEPT,
            order: 1,
            parentInTheNewPosition: null,
            insertLocation: null,
        },
        {
            item: items[3],
            action: ACTION_TYPE.ACCEPT,
            order: 2,
            parentInTheNewPosition: documentId,
            insertLocation: 'after:6121',
        },

    ];


    expect(new ParentItemHandler(items, documentId).handleOptions(items[6], ACTION_TYPE.ACCEPT)).toStrictEqual(expectedResult);
});
