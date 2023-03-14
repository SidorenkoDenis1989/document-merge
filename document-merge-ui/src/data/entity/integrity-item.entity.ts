export enum IntegrityItemType {
    NONE = 'identical',
    NEW = 'add',
    DELETE = 'delete',
    MOVED = 'move',
    MODIFY = 'modify',
    MOVED_AND_MODIFY = 'move and modify',
}

export enum MOVED_POSITION {
    NEW = 'new',
    OLD = 'old',
}

export class IntegrityItem {
    id: string;
    oldId: string;
    secondaryId: string;
    category: string;
    section?: string;
    primarySection: string;
    secondarySection: string;
    text: string;
    parentId?: string;
    type: IntegrityItemType;
    movedPosition?: MOVED_POSITION;
    fields?: { [key: string]: string };
    changedFields: { [key: string]: ChangedField };
    changedAttachments: AttachmentDetailsDto[];
}

export class AttachmentDetailsDto {
    attachmentId: string;
    primaryFileName: string;
    primaryItemId: string;
    fieldName: string;
    secondaryFileName: string;
    secondaryItemId: string;
}

export class ChangedField {
    oldValue: string;
    newValue: string;
}
