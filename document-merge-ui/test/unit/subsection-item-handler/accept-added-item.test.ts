import { ActionOptions, IntegrityItem, IntegrityItemType, MOVED_POSITION } from '@data';
import { ACTION_TYPE, ParentItemHandler } from '../../../src/service/parent-item-handler';

const items: IntegrityItem[] = [{
    'id': '6865',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6864',
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
    'id': '6873',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6865',
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
    'id': '6926',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6921',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '2',
    'text': '2',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '2',
}, {
    'id': '6928',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6926',
    'category': 'Comment',
    'primarySection': null,
    'secondarySection': '2.1',
    'text': '2.1',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '2.1',
}, {
    'id': '6866',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6864',
    'category': 'Heading',
    'primarySection': '2',
    'secondarySection': '3',
    'text': '3',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '3',
}, {
    'id': '6875',
    'oldId': null,
    'secondaryId': null,
    'parentId': '6866',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': '3.1',
    'text': '3.1',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
    'section': '3.1',
}];

const documentId = '#documentId';

test('ACCEPT_ADDED_ITEM', () => {
    /*
    * 2. - Parent - added
    *   2.1 - Child - added
    * Expected:
    *   2 => accept
    * */

    const expectedResult: ActionOptions[] = [
        {
            item: items[2],
            action: ACTION_TYPE.ACCEPT,
            order: 1,
            parentInTheNewPosition: documentId,
            insertLocation: 'after:'+ items[0].id,
        }

    ];


    expect(new ParentItemHandler(items, documentId).handleOptions(items[2], ACTION_TYPE.ACCEPT)).toStrictEqual(expectedResult);
});
