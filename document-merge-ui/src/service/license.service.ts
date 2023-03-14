import { inject, injectable } from 'inversify';
import { NangaLicenseDto, TYPES } from '@data';
import type { ENDPOINT_TYPE } from '@data';

export interface LicenseService {
    getLicense(): Promise<NangaLicenseDto>;
    setLicense(licenseKey: string): Promise<NangaLicenseDto>;
}

@injectable()
export class LicenseServiceImpl implements LicenseService {
    constructor(@inject(TYPES.ENDPOINTS) private ENDPOINTS: ENDPOINT_TYPE) {}

    getLicense(): Promise<NangaLicenseDto> {
        return this.ENDPOINTS.LICENSE.GET();
    }

    setLicense(licenseKey: string): Promise<NangaLicenseDto> {
        return this.ENDPOINTS.LICENSE.SET(licenseKey);
    }
}
