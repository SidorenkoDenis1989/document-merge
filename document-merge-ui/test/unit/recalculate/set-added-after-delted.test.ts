import { IntegrityItem, IntegrityItemType } from '@data/entity/integrity-item.entity';
import { SectionSorter, SectionCalculator } from '@utils';
import { removeSection } from './utils';

const items: IntegrityItem[] = [{
    'id': '7420',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7413',
    'category': 'Heading',
    'primarySection': '1.1',
    'secondarySection': '1.1',
    'text': '<!-- MKS HTML --><h2>Background</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7413',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7412',
    'category': 'Heading',
    'primarySection': '1',
    'secondarySection': '1',
    'text': '<!-- MKS HTML --><h1>Introduction</h1>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7478',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7469',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '2',
    'text': '<!-- MKS HTML --><p>New Item</p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7423',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7414',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': null,
    'text': '<!-- MKS HTML -->This specifies constraints ',
    'type': IntegrityItemType.DELETE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7415',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7412',
    'category': 'Heading',
    'primarySection': '3',
    'secondarySection': '3',
    'text': '<!-- MKS HTML --><h2>Definitions</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7425',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7415',
    'category': 'Comment',
    'primarySection': '3.1',
    'secondarySection': '3.1',
    'text': '<!-- MKS HTML -->Names are very important.',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7414',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7412',
    'category': 'Heading',
    'primarySection': '2',
    'secondarySection': null,
    'text': '<!-- MKS HTML --><h2>Constraints</h2>',
    'type': IntegrityItemType.DELETE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7480',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7478',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '2.1',
    'text': '<!-- MKS HTML --><p>New sub item</p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}];

const expectedWithSection: IntegrityItem[] = [
    {...items[1], section: '1'},
    {...items[0], section: '1.1'},
    {...items[6], section: '2'},
    {...items[3], section: '2.1'},
    {...items[2], section: '2'},
    {...items[7], section: '2.1'},
    {...items[4], section: '3'},
    {...items[5], section: '3.1'},
];

const expectedWithoutSection = removeSection(expectedWithSection);

test('display added items after deleted - sort', () => {
    const result = SectionSorter.sort(items);
    expect(result).toEqual(expectedWithoutSection);
});

test('display added items after deleted - calc section', () => {
    const result = SectionCalculator.recalculate(expectedWithoutSection);
    expect(result).toEqual(expectedWithSection);
});
