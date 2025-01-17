
import { Readable } from 'stream';

export interface IRandomString {
    tokenLength?: number;
    datePrefix?: boolean;
}

export interface IUniqueName {
    tmpPrefix?: boolean;
    tokenLength?: number;
    datePrefix?: boolean;
}

export interface IMulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
    stream: Readable;
}

export interface IFileObjectOptions {
    fieldname?: string;
    encoding?: string;
    mimetype?: string;
    stream?: boolean;
}