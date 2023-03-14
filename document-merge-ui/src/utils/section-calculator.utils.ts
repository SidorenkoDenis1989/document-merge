import { INTEGRITY_ITEM_MOVED_TYPES, IntegrityItem, IntegrityItemType, MOVED_POSITION } from '@data';
import { deepCopy } from '@utils';

export class SectionSorter {
    private readonly primarySectionTypes: IntegrityItemType[] = [
        IntegrityItemType.DELETE,
        IntegrityItemType.MOVED,
        IntegrityItemType.MOVED_AND_MODIFY,
    ];
    private readonly secondarySectionTypes: IntegrityItemType[] = [
        IntegrityItemType.NEW,
        IntegrityItemType.MOVED,
        IntegrityItemType.MOVED_AND_MODIFY,
    ];

    private readonly primarySectionMap = new Map<string, IntegrityItem>();
    private readonly secondarySectionMap = new Map<string, IntegrityItem>();
    private readonly secondaryDocument: IntegrityItem[] = [];
    private readonly result: IntegrityItem[] = [];

    static sort(items: IntegrityItem[]) {
        return new SectionSorter().parse(items);
    }

    private parse(items: IntegrityItem[]): IntegrityItem[] {
        this.fillMaps(items);
        this.fillResultUsingPrimaryDocument();
        this.fillSecondaryDocument();
        this.join();
        return this.result;
    }

    private fillMaps(items: IntegrityItem[]) {
        items.forEach((item) => {
            const isSetMovedPosition = isMovedType(item.type);
            if (item.type !== IntegrityItemType.NEW) {
                this.primarySectionMap.set(item.primarySection, {
                    ...item,
                    movedPosition: isSetMovedPosition ? MOVED_POSITION.OLD : null,
                });
            }
            if (item.type !== IntegrityItemType.DELETE) {
                this.secondarySectionMap.set(item.secondarySection, {
                    ...item,
                    movedPosition: isSetMovedPosition ? MOVED_POSITION.NEW : null,
                });
            }
        });
    }

    private fillResultUsingPrimaryDocument() {
        this.searchSection('1', this.primarySectionMap, this.result);
    }

    private fillSecondaryDocument() {
        this.searchSection('1', this.secondarySectionMap, this.secondaryDocument);
    }

    private searchSection(section: string, sectionMap: Map<string, IntegrityItem>, result: IntegrityItem[]) {
        const item = sectionMap.get(section);
        if (!item) {
            return;
        }
        result.push(item);
        this.searchSection(this.createChildSection(section), sectionMap, result);
        this.searchSection(this.createNextSection(section), sectionMap, result);
    }

    private createChildSection(section: string) {
        return section + '.1';
    }

    private createNextSection(section: string) {
        const sectionParts = splitSection(section);
        const lastSection = sectionParts.pop();
        sectionParts.push(lastSection + 1);
        return sectionParts.join('.');
    }

    private join() {
        let prev = null;
        let joined = [];
        this.secondaryDocument.forEach(item => {
            const isJoinedItem = this.secondarySectionTypes.includes(item.type);
            if (!isJoinedItem && !!joined.length) {
                this.handleJoinedItems(joined, prev);
                joined = [];
                prev = item;
                return;
            }
            if (isJoinedItem) {
                joined.push(item);
                return;
            }
            prev = item;
        });
        if (joined.length) {
            this.handleJoinedItems(joined, prev);
        }
    }

    private handleJoinedItems(joined: IntegrityItem[], prev: IntegrityItem) {
        const index = this.calcPrevItemIndex(prev);
        this.result.splice(index + 1, 0, ...joined);
    }

    private calcPrevItemIndex(prev: IntegrityItem): number {
        let index = -1;
        let isStart = !prev;
        for (let i = 0; i < this.result.length; i++) {
            const item = this.result[i];
            if (!isStart && item.id === prev.id) {
                index = i;
                isStart = true;
                continue;
            }
            if (!isStart) {
                continue;
            }
            if (!this.primarySectionTypes.includes(item.type)) {
                break;
            }
            index = i;
        }
        return index;
    }
}

const isMovedType = (type: IntegrityItemType) => INTEGRITY_ITEM_MOVED_TYPES.includes(type);
const splitSection = (section: string): number[] => {
    return section.split('.').map((value) => Number.parseInt(value, 10));
};
export const isOldMovedItem = (item: IntegrityItem) => isMovedType(item.type) && item.movedPosition === MOVED_POSITION.OLD;
export const isNewMovedItem = (item: IntegrityItem) => isMovedType(item.type) && item.movedPosition === MOVED_POSITION.NEW;

export class SectionCalculator {
    private prevItem: IntegrityItem = null;
    private readonly temporaryItems = new Map<string, IntegrityItem>();
    private readonly items: IntegrityItem[];

    constructor(items: IntegrityItem[]) {
        this.items = deepCopy(items);
    }

    static recalculate(items: IntegrityItem[]) {
        return new SectionCalculator(items)
            .recalculateSection();
    }

    private recalculateSection(): IntegrityItem[] {
        return this.items.map(item => {
            item.section = this.handleSection(item);
            this.changeIfBeforeTemporary(item);
            if (this.isPrimaryItem(item)) {
                this.temporaryItems.set(item.section, item);
            }
            this.prevItem = item;
            return item;
        });
    }

    private handleSection(currentItem: IntegrityItem): string {
        if (!this.prevItem) {
            return '1';
        }
        const prevSection = splitSection(this.prevItem.section);
        const currentSection = splitSection(this.getSection(currentItem));
        if (prevSection.length === currentSection.length) {
            return this.createNextSection(prevSection);
        }
        if (prevSection.length > currentSection.length) {
            return this.createUpSection(prevSection, currentSection.length);
        }

        return this.createChildSection(prevSection);
    }

    private changeIfBeforeTemporary(item: IntegrityItem) {
        const sectionParts = splitSection(item.section);
        const lastSection = sectionParts.pop();
        if (lastSection === 1) {
            return;
        }
        sectionParts.push(lastSection - 1);
        const newSection = sectionParts.join('.');
        const concurrentItem = this.temporaryItems.get(newSection);
        if (concurrentItem) {
            this.temporaryItems.delete(newSection);
            item.section = newSection;
        }
    }

    private getSection(item: IntegrityItem): string {
        if (this.isSecondaryItem(item)) {
            return item.secondarySection;
        }
        return item.primarySection;
    }

    private isPrimaryItem(item: IntegrityItem): boolean {
        return item.type === IntegrityItemType.DELETE || isOldMovedItem(item);
    }

    private isSecondaryItem(item: IntegrityItem): boolean {
        return item.type === IntegrityItemType.NEW || isNewMovedItem(item);
    }

    private createNextSection(section: number[]) {
        const sectionParts = [...section];
        const lastSection = sectionParts.pop();
        sectionParts.push(lastSection + 1);
        return sectionParts.join('.');
    }

    private createUpSection(section: number[], level: number) {
        const sectionParts = [...section];
        sectionParts.splice(level);
        sectionParts[sectionParts.length - 1] = sectionParts[sectionParts.length - 1] + 1;
        return sectionParts.join('.');
    }

    private createChildSection(section: number[]) {
        return section.join('.') + '.1';
    }

}
