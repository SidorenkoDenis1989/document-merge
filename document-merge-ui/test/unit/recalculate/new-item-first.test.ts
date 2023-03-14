import { IntegrityItem, IntegrityItemType } from '@data/entity/integrity-item.entity';
import { SectionCalculator, SectionSorter } from '@utils';
import { removeSection } from './utils';

const items: IntegrityItem[] = [{
    'id': '7484',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7482',
    'category': 'Heading',
    'primarySection': '2',
    'secondarySection': '3',
    'text': '<!-- MKS HTML --><h2>Constraints</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7483',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7482',
    'category': 'Heading',
    'primarySection': '1',
    'secondarySection': '2',
    'text': '<!-- MKS HTML --><h1>Introduction</h1>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7544',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7539',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '1',
    'text': '<!-- MKS HTML --><p>New Item</p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7546',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7544',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '1.1',
    'text': '<!-- MKS HTML --><p>new subitem</p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7490',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7483',
    'category': 'Heading',
    'primarySection': '1.1',
    'secondarySection': '2.1',
    'text': '<!-- MKS HTML --><h2>Background</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7493',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7484',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': '3.1',
    'text': '<!-- MKS HTML -->This specifies constraints.',
    'type':  IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}];

const expectedWithSection: IntegrityItem[] = [
    { ...items[2], section: '1' },
    { ...items[3], section: '1.1' },
    { ...items[1], section: '2' },
    { ...items[4], section: '2.1' },
    { ...items[0], section: '3', },
    { ...items[5], section: '3.1', },
];

const expectedWithoutSection = removeSection(expectedWithSection);

test('display new item first - sort', () => {
    const result = SectionSorter.sort(items);
    expect(result).toEqual(expectedWithoutSection);
});

test('display new item first - calc section', () => {
    const result = SectionCalculator.recalculate(expectedWithoutSection);
    expect(result).toEqual(expectedWithSection);
});
