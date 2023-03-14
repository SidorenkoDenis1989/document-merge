import { BYTES_IN_KB, BYTES_IN_MB } from '@data';

export const normalizeFileName = (fileName: string, existedFileNames: string[]): string => {
    let counter = 0;
    const lastDotPosition = fileName.lastIndexOf('.');

    const name = fileName.substring(0, lastDotPosition);
    const ext = fileName.substring(lastDotPosition + 1);

    const replaceFileName = (fileName) => {
        counter++;
        const checkOnExist = (existFileName) => existFileName === fileName;
        const isNotExistName = existedFileNames.findIndex(checkOnExist) === -1;
        if (isNotExistName) {
            return fileName;
        }
        return replaceFileName(`${name}(${counter}).${ext}`);
    };

    return replaceFileName(fileName);
};

export const prepareFileSize = (size: number) => {
    if (size < BYTES_IN_KB) {
        return `${size}Byte${size > 1 ? 's' : ''}`;
    }
    if (size < BYTES_IN_MB) {
        return `${Math.round(size / BYTES_IN_KB)}KB`;
    }
    return `${Math.round(size / BYTES_IN_MB)}MB`;
};
