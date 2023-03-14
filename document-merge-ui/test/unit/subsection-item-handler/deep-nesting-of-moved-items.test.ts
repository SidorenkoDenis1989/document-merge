import { ACTION_TYPE, OrderDecisionException, ParentItemHandler } from '../../../src/service/parent-item-handler';
import { ActionOptions, IntegrityItem, IntegrityItemType, MOVED_POSITION } from '@data';
import { MultipleActionHandlerUtil, SectionCalculator } from '@utils';

describe('deep nesting of moved items', () => {

    const items: IntegrityItem[] = [{
        'id': '7003',
        'oldId': null,
        'secondaryId': null,
        'parentId': '7002',
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
        'id': '7004',
        'oldId': null,
        'secondaryId': '7064',
        'parentId': '7002',
        'category': 'Heading',
        'primarySection': '2',
        'secondarySection': '1.1',
        'text': '1.1',
        'type': IntegrityItemType.MOVED,
        'changedFields': {},
        'movedPosition': MOVED_POSITION.NEW,
        'changedAttachments': [],
        'section': '1.1',
    }, {
        'id': '7005',
        'oldId': null,
        'secondaryId': '7065',
        'parentId': '7002',
        'category': 'Heading',
        'primarySection': '3',
        'secondarySection': '1.1.1',
        'text': '1.1.1',
        'type': IntegrityItemType.MOVED,
        'changedFields': {},
        'movedPosition': MOVED_POSITION.NEW,
        'changedAttachments': [],
        'section': '1.1.1',
    }, {
        'id': '7015',
        'oldId': null,
        'secondaryId': '7062',
        'parentId': '7005',
        'category': 'Comment',
        'primarySection': '3.1',
        'secondarySection': '1.1.1.1',
        'text': '1.1.1.1',
        'type': IntegrityItemType.MOVED,
        'changedFields': {},
        'movedPosition': MOVED_POSITION.NEW,
        'changedAttachments': [],
        'section': '1.1.1.1',
    }, {
        'id': '7013',
        'oldId': null,
        'secondaryId': '7061',
        'parentId': '7004',
        'category': 'Comment',
        'primarySection': '2.1',
        'secondarySection': '1.1.2',
        'text': '1.1.2',
        'type': IntegrityItemType.MOVED,
        'changedFields': {},
        'movedPosition': MOVED_POSITION.NEW,
        'changedAttachments': [],
        'section': '1.1.2',
    }, {
        'id': '7011',
        'oldId': null,
        'secondaryId': null,
        'parentId': '7003',
        'category': 'Heading',
        'primarySection': '1.1',
        'secondarySection': '1.2',
        'text': '1.2',
        'type': IntegrityItemType.NONE,
        'changedFields': {},
        'movedPosition': null,
        'changedAttachments': [],
        'section': '1.2',
    }, {
        'id': '7004',
        'oldId': null,
        'secondaryId': '7064',
        'parentId': '7002',
        'category': 'Heading',
        'primarySection': '2',
        'secondarySection': '1.1',
        'text': '2',
        'type': IntegrityItemType.MOVED,
        'changedFields': {},
        'movedPosition': MOVED_POSITION.OLD,
        'changedAttachments': [],
        'section': '2',
    }, {
        'id': '7013',
        'oldId': null,
        'secondaryId': '7061',
        'parentId': '7004',
        'category': 'Comment',
        'primarySection': '2.1',
        'secondarySection': '1.1.2',
        'text': '2.1',
        'type': IntegrityItemType.MOVED,
        'changedFields': {},
        'movedPosition': MOVED_POSITION.OLD,
        'changedAttachments': [],
        'section': '2.1',
    }, {
        'id': '7005',
        'oldId': null,
        'secondaryId': '7065',
        'parentId': '7002',
        'category': 'Heading',
        'primarySection': '3',
        'secondarySection': '1.1.1',
        'text': '2',
        'type': IntegrityItemType.MOVED,
        'changedFields': {},
        'movedPosition': MOVED_POSITION.OLD,
        'changedAttachments': [],
        'section': '2',
    }, {
        'id': '7015',
        'oldId': null,
        'secondaryId': '7062',
        'parentId': '7005',
        'category': 'Comment',
        'primarySection': '3.1',
        'secondarySection': '1.1.1.1',
        'text': '2.1',
        'type': IntegrityItemType.MOVED,
        'changedFields': {},
        'movedPosition': MOVED_POSITION.OLD,
        'changedAttachments': [],
        'section': '2.1',
    }, {
        'id': '7006',
        'oldId': null,
        'secondaryId': null,
        'parentId': '7002',
        'category': 'Heading',
        'primarySection': '4',
        'secondarySection': '2',
        'text': '2',
        'type': IntegrityItemType.NONE,
        'changedFields': {},
        'movedPosition': null,
        'changedAttachments': [],
        'section': '2',
    }, {
        'id': '7007',
        'oldId': null,
        'secondaryId': null,
        'parentId': '7002',
        'category': 'Heading',
        'primarySection': '5',
        'secondarySection': '3',
        'text': '3',
        'type': IntegrityItemType.NONE,
        'changedFields': {},
        'movedPosition': null,
        'changedAttachments': [],
        'section': '3',
    }];

    test('should throw an OrderDecisionException if an item cannot be inserted at the specified location', () => {
        const handler = new ParentItemHandler(items, 'document');

        expect(() => handler.handleOptions(items[2], ACTION_TYPE.ACCEPT)).toThrow(new OrderDecisionException(items[1]));
    });

    test('decline all items', () => {

        const expectedResult: ActionOptions[] = [
            {
                item: items[6],
                action: ACTION_TYPE.DECLINE,
                order: 1,
                parentInTheNewPosition: null,
                insertLocation: null,
            },
            {
                item: items[8],
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
            {
                item: items[7],
                action: ACTION_TYPE.DECLINE,
                order: 4,
                parentInTheNewPosition: null,
                insertLocation: null,
            },
        ];
        const result = new ParentItemHandler(items, 'document').handleOptions(items[6], ACTION_TYPE.DECLINE);
        expect(result).toStrictEqual(expectedResult);
    });

    const acceptFirstLevelExpectedResult: ActionOptions[] = [
        {
            item: items[1],
            action: ACTION_TYPE.ACCEPT,
            order: 1,
            parentInTheNewPosition: items[0].id,
            insertLocation: 'first',
        },
        {
            item: items[4],
            action: ACTION_TYPE.ACCEPT,
            order: 2,
            parentInTheNewPosition: items[1].id,
            insertLocation: 'first',
        },
    ];

    test('accept first level', () => {
        const result = new ParentItemHandler(items, 'document').handleOptions(items[1], ACTION_TYPE.ACCEPT);
        expect(result).toStrictEqual(acceptFirstLevelExpectedResult);
    });

    const expectedMultipleActionHandlerResult: IntegrityItem[] = [
        items[0],
        { ...items[1], primarySection: items[1].section, type: IntegrityItemType.NONE, movedPosition: null },
        items[2],
        items[3],
        { ...items[4], primarySection: items[4].section, type: IntegrityItemType.NONE, movedPosition: null },
        items[5],
        items[8],
        items[9],
        items[10],
        items[11],

    ];

    test('accept first level - apply options', () => {
        expect(new MultipleActionHandlerUtil(items)
            .handle(acceptFirstLevelExpectedResult))
            .toStrictEqual(expectedMultipleActionHandlerResult);
    });

    test('accept first level  - check Recalculate section', () => {

        expect(SectionCalculator.recalculate(expectedMultipleActionHandlerResult))
            .toStrictEqual(expectedMultipleActionHandlerResult);
    });

});
