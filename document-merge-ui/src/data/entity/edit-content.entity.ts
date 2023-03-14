import { AttachmentDetailsDto } from '@data/entity/integrity-item.entity';

export class EditContent {
    sourceItemId: string;
    contentId: string;
    fieldNameAndValue: { [key: string]: string };
    attachments: AttachmentDetailsDto[];
}
