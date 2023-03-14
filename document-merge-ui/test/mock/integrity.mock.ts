import {IntegrityItem, IntegrityItemType, MOVED_POSITION} from '@data';

export const INTEGRITY_ITEM: IntegrityItem[] = [{
    id: '1994',
    section: '1',
    category: 'Heading',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: IntegrityItemType.NONE,
    oldFields: null,
    newFields: null,
},
{
    id: '1995',
    section: '1.1',
    category: 'Deleted Item',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: IntegrityItemType.DELETE,
    oldFields: null,
    newFields: null,
},
{
    id: '1996',
    section: '1.2',
    category: 'Added Item',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: IntegrityItemType.NEW,
    oldFields: null,
    newFields: null,
},
{
    id: '1997',
    section: '1.3',
    category: 'Requirement',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: IntegrityItemType.NONE,
    oldFields: null,
    newFields: null,
},
{
    id: '1998',
    section: '2',
    category: 'Deleted Section',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: IntegrityItemType.DELETE,
    oldFields: null,
    newFields: null,
},
{
    id: '1999',
    section: '2.1',
    category: 'Section 2 Item',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: IntegrityItemType.NONE,
    oldFields: null,
    newFields: null,
},
{
    id: '2000',
    section: '1.4',
    category: '(Section 1.4) Moved from Section 2.2',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: IntegrityItemType.MOVED,
    movedPosition: MOVED_POSITION.NEW,
    oldFields: null,
    newFields: null,
},
{
    id: '2000',
    section: '2.2',
    category: '(Section 2.2) Moved to Section 1.4',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: IntegrityItemType.MOVED,
    movedPosition: MOVED_POSITION.OLD,
    oldFields: null,
    newFields: null,
},
{
    id: '2001',
    section: '1.5',
    category: '(Section 1.5) Moved from Section 2.3',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: IntegrityItemType.MOVED_AND_MODIFY,
    movedPosition: MOVED_POSITION.NEW,
    oldFields: {
        State: 'Open',
        Text: 'Lorem ipsum dolor'
    },
    newFields: {
        State: 'Close',
        Text: 'Lorem ipsum dolor*'
    },
},
{
    id: '2001',
    section: '2.3',
    category: '(Section 2.3) Moved to Section 1.5',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: IntegrityItemType.MOVED_AND_MODIFY,
    movedPosition: MOVED_POSITION.OLD,
    oldFields: {
        State: 'Open',
        Text: 'Lorem ipsum dolor'
    },
    newFields: {
        State: 'Close',
        Text: 'Lorem ipsum dolor*'
    },
},
{
    id: '2002',
    section: '2.4',
    category: 'Modify Item',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    type: IntegrityItemType.MODIFY,
    oldFields: {
        State: 'Open',
        Text: 'Lorem ipsum dolor'
    },
    newFields: {
        State: 'Close',
        Text: 'Lorem ipsum dolor*'
    },
}];
