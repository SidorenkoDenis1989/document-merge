import { inject, injectable } from 'inversify';
import { IntegrityItem, SIZE_PX, TYPES } from '@data';
import { MergeViewScope } from '@scope';
import { getId } from '@utils';

export interface MergeViewService {
    changeVisibleMergeConditions(): void;
    updateItemRef(element: HTMLDivElement, index: number): void;
    cleanItemsRefs(): void;
    scrollToItem(id: string, offsetHeight: number): void;
    getFocusedIndexItem(items: IntegrityItem[], offsetHeight: number): number;
    setFocusedItemId(id: string): void;
    toggleIsHideMergeHistory(): void;
}

@injectable()
export class MergeViewServiceImpl implements MergeViewService {
    private itemsRef: HTMLDivElement[] = [];
    constructor(@inject(TYPES.MERGE_VIEW_SCOPE) private mergeViewScope: MergeViewScope) {}

    changeVisibleMergeConditions(): void {
        this.mergeViewScope.isOpenMergeConditions = !this.mergeViewScope.isOpenMergeConditions;
    }

    updateItemRef(element: HTMLDivElement, index: number): void {
        this.itemsRef[index] = element;
    }

    cleanItemsRefs(): void {
        this.itemsRef = [];
    }

    scrollToItem(id: string, offsetHeight: number): void {
        const target = this.itemsRef.find((el) => el.id === id);
        if (!target) {
            return;
        }
        const { header } = SIZE_PX;
        const headerBarOffset = offsetHeight + header.height;
        window.scrollTo({
            top: target.offsetTop - headerBarOffset,
            behavior: 'auto',
        });
    }

    getFocusedIndexItem(items: IntegrityItem[], offsetHeight: number): number {
        let firstFocusedIndex = null;
        if (!this.itemsRef || !this.itemsRef.length) {
            return firstFocusedIndex;
        }
        for (let i = 0; i < items.length; i++) {
            const id = getId(items[i]);
            const ref = this.itemsRef.find((el) => el && el.id === id);
            if (!ref || !this.isVisible(ref, offsetHeight)) {
                continue;
            }
            if (this.mergeViewScope.focusedItemId !== id) {
                this.setFocusedItemId(id);
            }
            firstFocusedIndex = i;
            break;
        }
        if (firstFocusedIndex === null) {
            this.setFocusedItemId(null);
        }
        return firstFocusedIndex;
    }

    private isVisible(ref: HTMLDivElement, offsetHeight: number): boolean {
        const startPosition = window.scrollY + offsetHeight;
        const endPosition = window.scrollY + document.body.clientHeight;
        const endPositionEl = ref.offsetTop;

        return startPosition < endPositionEl && endPositionEl < endPosition;
    }

    setFocusedItemId(id: string): void {
        this.mergeViewScope.focusedItemId = id;
    }

    toggleIsHideMergeHistory() {
        this.mergeViewScope.isHideMergeHistory = !this.mergeViewScope.isHideMergeHistory;
    }
}
