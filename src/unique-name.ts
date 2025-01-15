import * as fs from 'fs';
import {randomString} from './random-string';

interface IUniqueName {
    tmpPrefix?: boolean;
    tokenLength?: number;
    datePrefix?: boolean;
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