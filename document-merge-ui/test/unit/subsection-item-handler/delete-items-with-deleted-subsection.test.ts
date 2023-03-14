import { ActionOptions, IntegrityItem, IntegrityItemType } from '../../../src/data';
import { ACTION_TYPE, ParentItemHandler } from '../../../src/service/parent-item-handler';

const items: IntegrityItem[] = [{
    'id': '6284',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6283',
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
    'id': '6291',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6284',
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
    'id': '6287',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6283',
    'category': 'Heading',
    'primarySection': '2',
    'secondarySection': null,
    'text': '<!-- MKS HTML --><h2>Use Cases</h2>',
    'type': IntegrityItemType.DELETE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '2',
}, {
    'id': '6298',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6287',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': null,
    'text': '<!-- MKS HTML -->A use case ',
    'type': IntegrityItemType.DELETE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '2.1',
}, {
    'id': '6299',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6287',
    'category': 'User Requirement',
    'primarySection': '2.2',
    'secondarySection': null,
    'text': '<!-- MKS HTML -->Use Case 001',
    'type': IntegrityItemType.DELETE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '2.2',
}, {
    'id': '6288',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6283',
    'category': 'Heading',
    'primarySection': '3',
    'secondarySection': '2',
    'text': '<!-- MKS HTML --><h2>System Requirements</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '2',
}];
const documentId = '#documentId';

test('ACCEPT_DELETED_ITEM_WITH_DELETED_SUBSECTION', () => {
    /*
     * 2 (deleted)
     *   2.1 (deleted)
     *   2.2 (deleted)
     * Expected:
     *  2 => accept
     *   2.1 => accept
     *   2.2 => accept
     * */

    const expectedResult: ActionOptions[] = [
        {
            item: items[2],
            action: ACTION_TYPE.ACCEPT,
            order: 1,
            parentInTheNewPosition: null,
            insertLocation: null,
        },
        {
            item: items[3],
            action: ACTION_TYPE.ACCEPT,
            order: 2,
            parentInTheNewPosition: null,
            insertLocation: null,
        },

        {
            item: items[4],
            action: ACTION_TYPE.ACCEPT,
            order: 3,
            parentInTheNewPosition: null,
            insertLocation: null,
        },

    ];

    expect(new ParentItemHandler(items, documentId).handleOptions(items[2], ACTION_TYPE.ACCEPT)).toStrictEqual(expectedResult);
});
