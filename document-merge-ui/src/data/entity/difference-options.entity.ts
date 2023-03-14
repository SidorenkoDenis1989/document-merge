import { MergeDocument } from '@data';

export class DifferenceOptions {
    hostId: number;
    primary: MergeDocument;
    secondary: MergeDocument;
    labelSecondary: string;
    labelPrimary: string;
    dateSecondary: string;
    datePrimary: string;
    comparedFields: string[];
}
