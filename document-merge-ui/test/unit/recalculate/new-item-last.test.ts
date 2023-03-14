import { IntegrityItem, IntegrityItemType } from '@data/entity/integrity-item.entity';
import { SectionCalculator, SectionSorter } from '@utils';
import { removeSection } from './utils';

const items: IntegrityItem[] = [{
    'id': '7574',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7567',
    'category': 'Heading',
    'primarySection': '1.1',
    'secondarySection': '1.1',
    'text': '<!-- MKS HTML --><h2>Background</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7630',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7628',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '3.1',
    'text': '<!-- MKS HTML --><p>New subitem</p><p><br></p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7567',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7566',
    'category': 'Heading',
    'primarySection': '1',
    'secondarySection': '1',
    'text': '<!-- MKS HTML --><h1>Introduction</h1>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7577',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7568',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': '2.1',
    'text': '<!-- MKS HTML -->This specifies constraints',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7568',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7566',
    'category': 'Heading',
    'primarySection': '2',
    'secondarySection': '2',
    'text': '<!-- MKS HTML --><h2>Constraints</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7628',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7623',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '3',
    'text': '<!-- MKS HTML --><p>New item</p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}];

const expectedWithSection: IntegrityItem[] = [
    { ...items[2], section: '1' },
    { ...items[0], section: '1.1' },
    { ...items[4], section: '2' },
    { ...items[3], section: '2.1' },
    { ...items[5], section: '3' },
    { ...items[1], section: '3.1' },
];

const expectedWithoutSection = removeSection(expectedWithSection);

test('display new item last - sort', () => {
    const result = SectionSorter.sort(items);
    expect(result).toEqual(expectedWithoutSection);
});

test('display new item last - calc section', () => {
    const result = SectionCalculator.recalculate(expectedWithoutSection);
    expect(result).toEqual(expectedWithSection);
});

