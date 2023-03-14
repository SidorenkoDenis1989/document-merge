import { IntegrityItem } from '@data/entity/integrity-item.entity';

export const removeSection = (items: IntegrityItem[]): IntegrityItem[] => items.map(item => {
    const copyItem = {...item};
    delete copyItem.section;
    return copyItem;
});
