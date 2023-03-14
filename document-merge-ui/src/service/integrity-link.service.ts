import { injectable, inject } from 'inversify';
import { TYPES } from '@data';
import { ApplicationInfoServiceImpl } from '@service';

export interface IntegrityLinkService {
    getLink(integrityItemID: string): Promise<string>;
}

@injectable()
export class IntegrityLinkServiceImpl implements IntegrityLinkService {
    private readonly protocol = 'http://';
    private readonly path = '/im/viewissue?selection=';

    constructor(@inject(TYPES.APPLICATION_INFO_SERVICE) private appInfoService: ApplicationInfoServiceImpl) {}

    async getLink(integrityItemID: string): Promise<string> {
        const host = await this.appInfoService.getCurrentHost();
        return this.protocol + host.host + ':' + host.port + this.path + integrityItemID;
    }
}
