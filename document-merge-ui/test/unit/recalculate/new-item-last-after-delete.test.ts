import { IntegrityItem, IntegrityItemType } from '@data/entity/integrity-item.entity';
import { SectionCalculator, SectionSorter } from '@utils';
import { removeSection } from './utils';


const items: IntegrityItem[] = [{
    'id': '7633',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7632',
    'category': 'Heading',
    'primarySection': '1',
    'secondarySection': '1',
    'text': '<!-- MKS HTML --><h1>Introduction</h1>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7646',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7641',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '2',
    'text': '<!-- MKS HTML --><p>New item</p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7635',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7633',
    'category': 'Heading',
    'primarySection': '1.1',
    'secondarySection': '1.1',
    'text': '<!-- MKS HTML --><h2>Background</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7634',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7632',
    'category': 'Heading',
    'primarySection': '2',
    'secondarySection': null,
    'text': '<!-- MKS HTML --><h2>Constraints</h2>',
    'type': IntegrityItemType.DELETE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7648',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7646',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '2.1',
    'text': '<!-- MKS HTML --><p>New subsection</p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7637',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7634',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': null,
    'text': '<!-- MKS HTML -->This specifies constraints',
    'type': IntegrityItemType.DELETE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}];

const expectedWithSection: IntegrityItem[] = [
    { ...items[0], section: '1' },
    { ...items[2], section: '1.1' },
    { ...items[3], section: '2' },
    { ...items[5], section: '2.1' },
    { ...items[1], section: '2' },
    { ...items[4], section: '2.1' },
];

const expectedWithoutSection = removeSection(expectedWithSection);

test('display new item last after delete - sort', () => {
    const result = SectionSorter.sort(items);
    expect(result).toEqual(expectedWithoutSection);
});


test('display new item last after delete - calc section', () => {
    const result = SectionCalculator.recalculate(expectedWithoutSection);
    expect(result).toEqual(expectedWithSection);
});

test('recalculate section after decline deleted items', () => {
    const deletedDeclinedItems: IntegrityItem[] = [
        { ...items[0], section: '1' },
        { ...items[2], section: '1.1' },
        { ...items[3], type: IntegrityItemType.NONE, section: '2' },
        { ...items[5], type: IntegrityItemType.NONE, section: '2.1' },
        { ...items[1], section: '2' },
        { ...items[4], section: '2.1' },
    ];
    const expected: IntegrityItem[] = [
        { ...items[0], section: '1' },
        { ...items[2], section: '1.1' },
        { ...items[3], type: IntegrityItemType.NONE, section: '2' },
        { ...items[5], type: IntegrityItemType.NONE, section: '2.1' },
        { ...items[1], section: '3' },
        { ...items[4], section: '3.1' },
    ];

    const result = SectionCalculator.recalculate(deletedDeclinedItems);
    expect(result).toEqual(expected);
});


test('recalculate section after accepted deleted items', () => {
    const deletedDeclinedItems: IntegrityItem[] = [
        { ...items[0], section: '1' },
        { ...items[2], section: '1.1' },
        { ...items[1], section: '2' },
        { ...items[4], section: '2.1' },
    ];
    const result = SectionCalculator.recalculate(deletedDeclinedItems);
    expect(result).toEqual(deletedDeclinedItems);
});
