import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import { isMulterFile, pathFromInput } from './multer-utils';
import { uniqueName } from './unique-name';

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
    stream: stream.Readable;
}

export interface IFileObjectOptions {
    fieldname?: string;
    encoding?: string;
    mimetype?: string;
    stream?: boolean;
}

export const fileObject = async (file: string, options: IFileObjectOptions = {}): Promise<IMulterFile> => {
    if (!file) return undefined;
    if (!fs.existsSync(file)) return undefined;


    const fileName = path.basename(file);
    const fileBuffer = await fs.promises.readFile(file);   
    const stats = await fs.promises.stat(file);

    const multerFile: Express.Multer.File = {
        fieldname: options.fieldname ? options.fieldname : 'file',
        originalname: fileName,
        encoding: options.encoding ? options.encoding : '7bit',
        mimetype: options.mimetype ? options.mimetype : 'application/octet-stream',
        size: stats.size,
        destination: path.dirname(file),
        filename: fileName,
        path: file,
        buffer: fileBuffer,
        stream: undefined,
    } as IMulterFile;

    
    if (options.stream) {
        multerFile.stream = await new Promise<fs.ReadStream>((resolve) => {
            const stream = fs.createReadStream(file);
            stream.on('open', () => {
                resolve(stream);
              });

            stream.on('error', (error) => {
                console.log(`file -> Stream of file '${file}' unnable to open: ${error}`);
                resolve(undefined);
            });
        });
    }

    return multerFile;
}

export const dataUrl = async (file: IMulterFile | string): Promise<unknown> => {
    if (!file) return undefined;
    if (!isMulterFile(file)) file = await fileObject(file as string);
    if (!file['originalname'] || !file['buffer']) return undefined;


    const extension: string = path.extname(file['originalname']).toLowerCase();
    const randomTmpName: string = `${uniqueName({ tmpPrefix: true, tokenLength: 32, datePrefix: true })}${extension}`;
    const filePath: string = `./${randomTmpName}`;


    fs.writeFileSync(filePath, file['buffer']);
    const dataUrl = await new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            const base64Data = Buffer.from(data).toString('base64');
            const type = mimeType(filePath as string);
            const dataUrl = `data:${type};base64,${base64Data}`;
            resolve(dataUrl);
        });
    });

    fs.unlinkSync(filePath);
    return dataUrl;
}

export const base64 = async (file: IMulterFile | string): Promise<string> => {
    if (!file) return undefined;

    const base64: string = isMulterFile(file)
        ? file['buffer'].toString('base64')
        : await new Promise<string>((resolve, reject) => {
            fs.readFile(file as string, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Buffer.from(data).toString('base64'));
                }
            });
        });

    if (!base64) return undefined;
    return base64;
}

export const mimeType = async (file: IMulterFile | string): Promise<string> => {
    if (!file) return undefined;

    const ext: string = isMulterFile(file)
        ? path.extname(file['originalname']).toLowerCase()
        : path.extname(file as string).toLowerCase();
    
    if (!ext) return undefined;
    switch (ext) {
        case '.jpg':
        case '.jpeg':
          return 'image/jpeg';
        case '.png':
          return 'image/png';
        case '.gif':
          return 'image/gif';
        case '.txt':
          return 'text/plain';
        case '.pdf':
          return 'application/pdf';
        default:
          return 'application/octet-stream'; // Generic MimeType for unknown files
    }
}

export const exists = async (file: IMulterFile | string): Promise<boolean> => {
    if (!file) return false;

    const filePath: string = pathFromInput(file);
    if (filePath == undefined || filePath.length == 0) return false;
    return fs.existsSync(filePath);
}

export const isDirectory = async (file: IMulterFile | string): Promise<boolean> => {
    const path: string = isMulterFile(file)
        ? file['path']
        : file as string;

    if (!exists(path)) return false;

    const stats = fs.statSync(path);
    if (!stats) return false;

    if (!stats.isDirectory()) return false;
    return true;
}

export const save = async (file: IMulterFile | string, destination: string, new_name: string = undefined): Promise<boolean> => {
    if (!file) return false;
    if (!destination) return false;

    if (!isMulterFile(file)) {
        file = await fileObject(file as string);
        if (!file) return false;
    }

    const extension: string = path.extname(file['originalname']).toLowerCase();
    const fileName: string = new_name
        ? `${new_name}${extension}`
        : `${file['originalname'].split(".")[0]}${extension}`;
    if (!fileName) return false;

    const filePath: string = path.join(destination, fileName);
    if (!filePath) return false;

    const fileWritted: boolean = await new Promise<boolean>((resolve, reject) => {
        fs.writeFile(filePath, file['buffer'], (err) => {
            if (err) {
                resolve(false);
            } else  {
                resolve(true);
            }
        });
    });

    if (!fileWritted) return false;
    if (!fs.existsSync(filePath)) return false;
    return true;
}

export const remove = async (file: IMulterFile | string): Promise<boolean> => {
    if (!file) return false;

    let filePath: string = undefined;
    if (isMulterFile(file)) {
        if (file['stream'] && !file['stream'].destroyed) file['stream'].destroy();
        filePath = file['path'];
    } else {
        filePath = file as string;
    }

    if (!filePath || filePath && filePath.length == 0) return false;
    if (!fs.existsSync(filePath)) return false;

    
    if (isDirectory(filePath)) {
        fs.rmSync(filePath, { recursive: true });
    } else {
        fs.unlinkSync(filePath);
    }


    if (fs.existsSync(filePath)) return false;
    return true;
}

export const write = async (file: IMulterFile | string, value: string = undefined): Promise<boolean> => {
    const path: string = isMulterFile(file)
        ? file['path']
        : file as string;

    const result: boolean = await new Promise<boolean>((resolve) => {
        fs.writeFile(path, value == undefined ? '' : value, (err) => {
            if (err) resolve(false);
            resolve(true);
        });
    });

    return result;
}

export const append = async (file: IMulterFile | string, value: string = undefined): Promise<boolean> => {
    if (!file) return false;

    const path: string = isMulterFile(file)
        ? file['path']
        : file as string;

    if (!await exists(path)) return false;

    fs.appendFileSync(path, value == undefined ? '' : value);
    return true;
}

export const read = async (file: IMulterFile | string): Promise<Buffer> => {
    const path: string = isMulterFile(file)
        ? file['path']
        : file as string;

    if (!exists(file)) return undefined;
    if (!isDirectory(file)) return undefined;
    return fs.readFileSync(path);
}