import { inject, injectable } from 'inversify';
import { INTEGRITY_ITEM_MOVED_TYPES, IntegrityItem, MOVED_POSITION, TYPES } from '@data';
import { IntegrityScope } from '@scope';
import type { ENDPOINT_TYPE } from '@data';


export interface ExportService {
    exportToWord(): Promise<void>;

    exportToPDF(): Promise<void>;

    exportToHtml(): Promise<void>;

    exportToXml(): Promise<void>;
}

@injectable()
export class ExportServiceImpl implements ExportService {

    constructor(
        @inject(TYPES.INTEGRITY_SCOPE) private integrityScope: IntegrityScope,
        @inject(TYPES.ENDPOINTS) private ENDPOINTS: ENDPOINT_TYPE,
    ) {
    }

    exportToWord(): Promise<void> {
        return this.ENDPOINTS.EXPORT_DIFFERENCE.WORD({
            diff: this.getDiff(),
            documentsData: this.integrityScope.differenceOptions,
        }).then(blob => this.saveFile(blob, 'difference.docx'));
    }

    exportToPDF(): Promise<void> {
        return this.ENDPOINTS.EXPORT_DIFFERENCE.PDF({
            diff: this.getDiff(),
            documentsData: this.integrityScope.differenceOptions,
        }).then(blob => this.saveFile(blob, 'difference.pdf'));
    }

    exportToHtml(): Promise<void> {
        return this.ENDPOINTS.EXPORT_DIFFERENCE.HTML({
            diff: this.getDiff(),
            documentsData: this.integrityScope.differenceOptions,
        }).then(blob => this.saveFile(blob, 'difference.html'));
    }

    exportToXml(): Promise<void> {
        return this.ENDPOINTS.EXPORT_DIFFERENCE.XML({
            diff: this.getDiff(),
            documentsData: this.integrityScope.differenceOptions,
        }).then(blob => this.saveFile(blob, 'difference.xml'));
    }

    private getDiff(): IntegrityItem[] {
        return this.integrityScope.integrityItems
            .filter(item => {
                if (INTEGRITY_ITEM_MOVED_TYPES.includes(item.type) && item.movedPosition === MOVED_POSITION.NEW) {
                    return false;
                }
                return true;
            });
    }

    private saveFile(blob: Blob, name: string) {
        // create file link in browser's memory
        const href = URL.createObjectURL(blob);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    }
}
