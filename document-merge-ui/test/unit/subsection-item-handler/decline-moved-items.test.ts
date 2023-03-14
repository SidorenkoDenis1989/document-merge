import { ActionOptions, IntegrityItem, IntegrityItemType, MOVED_POSITION } from '@data';
import { ACTION_TYPE, ParentItemHandler } from '../../../src/service/parent-item-handler';


test('DECLINE_MOVED_ITEMS', () => {

    const items: IntegrityItem[] = [
        {
            'id': '6035',
            'oldId': null,
            'secondaryId': null,
            'parentId': '6034',
            'category': 'Heading',
            'primarySection': '1',
            'secondarySection': '1',
            'text': '\x3C!-- MKS HTML --><h1>Introduction</h1>',
            'type': IntegrityItemType.NONE,
            'changedFields': {},
            'movedPosition': null,
            'changedAttachments': [],
            'section': '1',
        },
        {
            'id': '6042',
            'oldId': null,
            'secondaryId': null,
            'parentId': '6035',
            'category': 'Heading',
            'primarySection': '1.1',
            'secondarySection': '1.1',
            'text': '\x3C!-- MKS HTML --><h2>Background</h2>',
            'type': IntegrityItemType.NONE,
            'changedFields': {},
            'movedPosition': null,
            'changedAttachments': [],
            'section': '1.1',
        },
        {
            'id': '6036',
            'oldId': null,
            'secondaryId': '6093',
            'parentId': '6034',
            'category': 'Heading',
            'primarySection': '2',
            'secondarySection': '3',
            'text': '\x3C!-- MKS HTML --><h2>Constraints</h2>',
            'type': IntegrityItemType.MOVED,
            'changedFields': {},
            'movedPosition': MOVED_POSITION.OLD,
            'changedAttachments': [],
            'section': '2',
        }, {
            'id': '6045',
            'oldId': null,
            'secondaryId': '6101',
            'parentId': '6036',
            'category': 'Comment',
            'primarySection': '2.1',
            'secondarySection': '3.1',
            'text': '\x3C!-- MKS HTML -->This specifies constraints',
            'type': IntegrityItemType.MOVED,
            'changedFields': {},
            'movedPosition': MOVED_POSITION.OLD,
            'changedAttachments': [],
            'section': '2.1',
        }, {
            'id': '6037',
            'oldId': null,
            'secondaryId': null,
            'parentId': '6034',
            'category': 'Heading',
            'primarySection': '3',
            'secondarySection': '2',
            'text': '\x3C!-- MKS HTML --><h2>Definitions</h2>',
            'type': IntegrityItemType.NONE,
            'changedFields': {},
            'movedPosition': null,
            'changedAttachments': [],
            'section': '2',
        }, {
            'id': '6047',
            'oldId': null,
            'secondaryId': null,
            'parentId': '6037',
            'category': 'Comment',
            'primarySection': '3.1',
            'secondarySection': '2.1',
            'text': '\x3C!-- MKS HTML -->Names are very important.',
            'type': IntegrityItemType.NONE,
            'changedFields': {},
            'movedPosition': null,
            'changedAttachments': [],
            'section': '2.1',
        }, {
            'id': '6036',
            'oldId': null,
            'secondaryId': '6093',
            'parentId': '6034',
            'category': 'Heading',
            'primarySection': '2',
            'secondarySection': '3',
            'text': '\x3C!-- MKS HTML --><h2>Constraints</h2>',
            'type': IntegrityItemType.MOVED,
            'changedFields': {},
            'movedPosition': MOVED_POSITION.NEW,
            'changedAttachments': [],
            'section': '3',
        }, {
            'id': '6045',
            'oldId': null,
            'secondaryId': '6101',
            'parentId': '6036',
            'category': 'Comment',
            'primarySection': '2.1',
            'secondarySection': '3.1',
            'text': '\x3C!-- MKS HTML -->This specifies constraints ',
            'type': IntegrityItemType.MOVED,
            'changedFields': {},
            'movedPosition': MOVED_POSITION.NEW,
            'changedAttachments': [],
            'section': '3.1',
        }, {
            'id': '6038',
            'oldId': null,
            'secondaryId': null,
            'parentId': '6034',
            'category': 'Heading',
            'primarySection': '4',
            'secondarySection': '4',
            'text': '\x3C!-- MKS HTML --><h2>Use Cases</h2>',
            'type': IntegrityItemType.NONE,
            'changedFields': {},
            'movedPosition': null,
            'changedAttachments': [],
            'section': '4',
        },

    ];

    /*
   * 2. - Parent - (moved old Position)
   *   2.1 - Child - (moved old Position)
   * 3. - Parent - (moved new Position)
   *   3.1 - Child - (moved new Position)
   * Expected:
   *   3 => decline
   *   3.1 => decline
   * */

    const documentId = '#documentId';

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
    ];


    expect(new ParentItemHandler(items, documentId).handleOptions(items[2], ACTION_TYPE.DECLINE)).toStrictEqual(expectedResult);
});
