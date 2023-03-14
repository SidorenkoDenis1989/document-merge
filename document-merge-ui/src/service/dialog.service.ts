import { inject, injectable } from 'inversify';
import { TYPES } from '@data';
import { DialogScope } from '@scope';
import { v1 as uuid } from 'uuid';

export interface DialogService {
    hide(dialogKey: string): void;
    show(node: React.ReactNode): string;
    hideLast(): void;
    hideAll(): void;
}

@injectable()
export class DialogServiceImpl implements DialogService {
    constructor(@inject(TYPES.DIALOG_SCOPE) private dialogScope: DialogScope) {}

    hide(dialogKey: string): void {
        const { dialogs } = this.dialogScope;
        this.dialogScope.dialogs = dialogs.filter((dialog) => dialog.key !== dialogKey);
    }

    show(node: React.ReactNode): string {
        const key = uuid();
        const { dialogs } = this.dialogScope;
        this.dialogScope.dialogs = [...dialogs, { key, node }];
        return key;
    }

    hideAll(): void {
        this.dialogScope.dialogs = [];
    }

    hideLast(): void {
        const { dialogs } = this.dialogScope;
        this.dialogScope.dialogs = dialogs.slice(0, dialogs.length - 1);
    }
}
