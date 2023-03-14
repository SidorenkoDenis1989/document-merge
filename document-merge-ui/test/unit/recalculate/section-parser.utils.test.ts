import { IntegrityItem, IntegrityItemType, MOVED_POSITION } from '@data/entity/integrity-item.entity';
import { SectionCalculator, SectionSorter } from '@utils';
import { removeSection } from './utils';

const items: IntegrityItem[] = [{
    'id': '7341',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7336',
    'category': 'Heading',
    'primarySection': '5',
    'secondarySection': '3',
    'text': '<!-- MKS HTML --><h2>System Requirements</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7351',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7340',
    'category': 'Comment',
    'primarySection': '4.1',
    'secondarySection': '2.1',
    'text': '<!-- MKS HTML -->A use case diagram identifies the boundaries between the users (actors) and the product ',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7340',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7336',
    'category': 'Heading',
    'primarySection': '4',
    'secondarySection': '2',
    'text': '<!-- MKS HTML --><h2>Use Cases</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7343',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7336',
    'category': 'Heading',
    'primarySection': '7',
    'secondarySection': '7',
    'text': '<!-- MKS HTML --><h2>Non-Functional Requirements</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7342',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7336',
    'category': 'Heading',
    'primarySection': '6',
    'secondarySection': '6',
    'text': '<!-- MKS HTML --><h2>Functional Requirements</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7356',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7341',
    'category': 'Comment',
    'primarySection': '5.1',
    'secondarySection': '3.1',
    'text': '<!-- MKS HTML -->A system requirement illustrates key technical considerations for the system.',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7410',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7408',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '4.1',
    'text': '<!-- MKS HTML --><p>new subsitem</p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7366',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7343',
    'category': 'Comment',
    'primarySection': '7.1',
    'secondarySection': '7.1',
    'text': '<!-- MKS HTML -->Nonfunctional requirements are the properties that the functions must have, such as performance and usability.',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7344',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7337',
    'category': 'Heading',
    'primarySection': '1.1',
    'secondarySection': '1.1',
    'text': '<!-- MKS HTML --><h2>Background</h2>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7347',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7338',
    'category': 'Comment',
    'primarySection': '2.1',
    'secondarySection': null,
    'text': '<!-- MKS HTML -->This specifies constraints on the way ',
    'type': IntegrityItemType.DELETE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7361',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7342',
    'category': 'Comment',
    'primarySection': '6.1',
    'secondarySection': '6.1',
    'text': '<!-- MKS HTML -->Functional requirements are',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7349',
    'oldId': null,
    'secondaryId': '7405',
    'parentId': '7339',
    'category': 'Comment',
    'primarySection': '3.1',
    'secondarySection': '5.1',
    'text': '<!-- MKS HTML -->Names are very important.',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7338',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7336',
    'category': 'Heading',
    'primarySection': '2',
    'secondarySection': null,
    'text': '<!-- MKS HTML --><h2>Constraints</h2>',
    'type': IntegrityItemType.DELETE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7337',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7336',
    'category': 'Heading',
    'primarySection': '1',
    'secondarySection': '1',
    'text': '<!-- MKS HTML --><h1>Introduction</h1>',
    'type': IntegrityItemType.NONE,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7339',
    'oldId': null,
    'secondaryId': '7398',
    'parentId': '7336',
    'category': 'Heading',
    'primarySection': '3',
    'secondarySection': '5',
    'text': '<!-- MKS HTML --><h2>Definitions</h2>',
    'type': IntegrityItemType.MOVED,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}, {
    'id': '7408',
    'oldId': null,
    'secondaryId': null,
    'parentId': '7393',
    'category': 'Functional Requirement',
    'primarySection': null,
    'secondarySection': '4',
    'text': '<!-- MKS HTML --><p>New</p>',
    'type': IntegrityItemType.NEW,
    'changedFields': {},
    'movedPosition': null,
    'changedAttachments': [],
}];

const expectedWithSection: IntegrityItem[] = [
    { ...items[13], section: '1' },
    { ...items[8], section: '1.1' },
    { ...items[12], section: '2' }, // deleted
    { ...items[9], section: '2.1' }, // deleted
    { ...items[14], section: '2', movedPosition: MOVED_POSITION.OLD }, // moved old
    { ...items[11], section: '2.1', movedPosition: MOVED_POSITION.OLD }, // moved old
    { ...items[2], section: '2' }, // unchanged
    { ...items[1], section: '2.1' },// unchanged
    { ...items[0], section: '3' },
    { ...items[5], section: '3.1' },
    { ...items[15], section: '4' }, // new
    { ...items[6], section: '4.1' }, // new
    { ...items[14], section: '5', movedPosition: MOVED_POSITION.NEW }, // moved new
    { ...items[11], section: '5.1', movedPosition: MOVED_POSITION.NEW }, // moved new
    { ...items[4], section: '6' },
    { ...items[10], section: '6.1' },
    { ...items[3], section: '7' },
    { ...items[7], section: '7.1' },
];

const expectedWithoutSection = removeSection(expectedWithSection);

test('section-parser - sort', () => {
    const result = SectionSorter.sort(items);
    expect(result).toEqual(expectedWithoutSection);
});

test('section-parser - calc section', () => {
    const result = SectionCalculator.recalculate(expectedWithoutSection);
    expect(result).toEqual(expectedWithSection);
});

test('recalculate section after accept moved items', () => {
    const checkItems: IntegrityItem[] = [
        { ...items[13], section: '1' },
        { ...items[8], section: '1.1' },
        { ...items[12], section: '2' }, // deleted
        { ...items[9], section: '2.1' }, // deleted
        { ...items[2], section: '2' }, // unchanged
        { ...items[1], section: '2.1' },// unchanged
        { ...items[0], section: '3' },
        { ...items[5], section: '3.1' },
        { ...items[15], section: '4' }, // new
        { ...items[6], section: '4.1' }, // new
        { ...items[14], section: '5', type: IntegrityItemType.NONE, movedPosition: MOVED_POSITION.NEW }, // moved new
        { ...items[11], section: '5.1', type: IntegrityItemType.NONE, movedPosition: MOVED_POSITION.NEW }, // moved new
        { ...items[4], section: '6' },
        { ...items[10], section: '6.1' },
        { ...items[3], section: '7' },
        { ...items[7], section: '7.1' },
    ];

    const result = SectionCalculator.recalculate(checkItems);
    expect(result).toEqual(checkItems);
});


test('recalculate section after declined moved items', () => {
    const checkItems: IntegrityItem[] = [
        { ...items[13], section: '1' },
        { ...items[8], section: '1.1' },
        { ...items[12], section: '2' }, // deleted
        { ...items[9], section: '2.1' }, // deleted
        { ...items[14], section: '2',  type: IntegrityItemType.NONE, movedPosition: MOVED_POSITION.OLD }, // moved old
        { ...items[11], section: '2.1',  type: IntegrityItemType.NONE, movedPosition: MOVED_POSITION.OLD }, // moved old
        { ...items[2], section: '2' }, // unchanged
        { ...items[1], section: '2.1' },// unchanged
        { ...items[0], section: '3' },
        { ...items[5], section: '3.1' },
        { ...items[15], section: '4' }, // new
        { ...items[6], section: '4.1' }, // new
        { ...items[4], section: '6' },
        { ...items[10], section: '6.1' },
        { ...items[3], section: '7' },
        { ...items[7], section: '7.1' },
    ];
    const expectedResult: IntegrityItem[] = [
        { ...items[13], section: '1' },
        { ...items[8], section: '1.1' },
        { ...items[12], section: '2' }, // deleted
        { ...items[9], section: '2.1' }, // deleted
        { ...items[14], section: '2',  type: IntegrityItemType.NONE, movedPosition: MOVED_POSITION.OLD }, // moved old
        { ...items[11], section: '2.1',  type: IntegrityItemType.NONE, movedPosition: MOVED_POSITION.OLD }, // moved old
        { ...items[2], section: '3' }, // unchanged
        { ...items[1], section: '3.1' },// unchanged
        { ...items[0], section: '4' },
        { ...items[5], section: '4.1' },
        { ...items[15], section: '5' }, // new
        { ...items[6], section: '5.1' }, // new
        { ...items[4], section: '6' },
        { ...items[10], section: '6.1' },
        { ...items[3], section: '7' },
        { ...items[7], section: '7.1' },
    ];

    const result = SectionCalculator.recalculate(checkItems);
    expect(result).toEqual(expectedResult);
});
