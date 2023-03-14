import { IntegrityItem, IntegrityItemType } from '@data/entity/integrity-item.entity';
import { SectionCalculator, SectionSorter } from '@utils';
import { removeSection } from './utils';


const items: IntegrityItem[] = [{
    'id': '7550',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7548',
    'category': 'Heading',
    'primarySection': '2',
    'secondarySection': '2',
    'text': '<!-- MKS HTML --><h2>Constraints</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7562',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7557',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '1',
    'text': '<!-- MKS HTML --><p>New item</p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7551',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7549',
    'category': 'Heading',
    'primarySection': '1.1',
    'secondarySection': null,
    'text': '<!-- MKS HTML --><h2>Background</h2>',
    'type': IntegrityItemType.DELETE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7564',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7562',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '1.1',
    'text': '<!-- MKS HTML --><p>New subsection</p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7553',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7550',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': '2.1',
    'text': '<!-- MKS HTML -->This specifies constraints',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7549',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7548',
    'category': 'Heading',
    'primarySection': '1',
    'secondarySection': null,
    'text': '<!-- MKS HTML --><h1>Introduction</h1>',
    'type': IntegrityItemType.DELETE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}];

const expectedWithSection: IntegrityItem[] = [
    { ...items[5], section: '1' },
    { ...items[2], section: '1.1' },
    { ...items[1], section: '1' },
    { ...items[3], section: '1.1' },
    { ...items[0], section: '2' },
    { ...items[4], section: '2.1' },
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
