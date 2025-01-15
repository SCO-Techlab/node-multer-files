export const isMulterFile = (file: Express.Multer.File | string) => {
    if (typeof file == 'string') return false;
    return true;
}

export const pathFromInput = (file: Express.Multer.File | string) => {
    if (isMulterFile(file)) return file['path'] ? file['path'] : file;
    return file;
}
