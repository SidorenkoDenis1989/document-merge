import { DifferenceOptions, IntegrityItem } from '@data';

export class ExportOptionsDto {
    documentsData: DifferenceOptions;
    diff: IntegrityItem[];
}
