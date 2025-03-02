import { IRandomString, IUniqueName } from './multer-types';
import * as fs from 'fs';

export const isMulterFile = (file: Express.Multer.File | string) => {
    if (typeof file == 'string') return false;
    return true;
}

export const pathFromInput = (file: Express.Multer.File | string) => {
    if (isMulterFile(file)) return file['path'] ? file['path'] : file;
    return file;
}

export const randomString = (options: IRandomString = { tokenLength: 32, datePrefix: true }) => {
    if (options.tokenLength % 2 != 0) {
        options.tokenLength = options.tokenLength + 1;
    }

    const possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let text: string = "";
    for (let i = 0; i < options.tokenLength; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    let formattedText: string = "";
    for (let i = 0; i < text.length; i++) {
        formattedText += text.charAt(i);
        if ((i + 1) % 4 === 0 && i !== text.length - 1) {
            formattedText += '-';
        }
    }

    if (options.datePrefix) return `${Date.now()}-${formattedText}`;
    return formattedText;
}

export const uniqueName = (options: IUniqueName = { tmpPrefix: true, tokenLength: 32, datePrefix: true }) => {
    let randomTmpName: string = `${options.tmpPrefix ? 'mftmp-' : ''}${randomString({ tokenLength: options.tokenLength, datePrefix: options.datePrefix})}`;
    let existTmpFile: boolean = true;

    
    while (existTmpFile) {
        existTmpFile = fs.existsSync(`./${randomTmpName}`);
        if (existTmpFile) {
            randomTmpName = `${options.tmpPrefix ? 'mftmp-' : ''}${randomString({ tokenLength: options.tokenLength, datePrefix: options.datePrefix})}`;
        }
    }

    return randomTmpName;
}