import {IntegrityItem} from '@data';
import {getActiveHostId} from "./location.utils";

export const convertArrayToString = (array: string[]): string => {
    return array.join(',');
};

export const convertStringToArray = (str: string): string[] => {
    return str.length ? str.split(',').map((val) => val.trim()) : [];
};

export const getId = (item: IntegrityItem) => {
    return item.id + (item.movedPosition || '');
};

export const replaceEnterValue = (value: string, itemId: string) => {
    value = value.replace('<!-- MKS HTML -->', '')
    const regexWithAttachmentLink = new RegExp('<a href=\"mks:\/\/\/item\/field?.fieldid=.*&attachmentname=[`~!@#$%^&()+\\-=\\[\\]{},;\'a-zA-Z0-9 _.]*">(.*)<\/a>');
    const mksAttachmentPrefix = new RegExp('<a href=\"mks:\/\/\/item\/field?.fieldid=')
    const attachmentNameParam = new RegExp('&attachmentname=')
    const newAttachmentNameParam = '&attachmentName=';
    while (regexWithAttachmentLink.test(value)) {
        const downloadName = value.match(regexWithAttachmentLink);
        const newLinkPrefix = `<a download=${downloadName[1]} href=\"/user/documents/attachment?hostId=${getActiveHostId()}&itemId=${itemId}&fieldName=`
        value = value.replace(mksAttachmentPrefix, newLinkPrefix)
        value = value.replace(attachmentNameParam, newAttachmentNameParam)
    }
    return value
};