import { Injectable } from "@nestjs/common";
import * as easyfiles from '@sco-techlab/node-multer-files';

export const TEST_PATH: string = ``;

@Injectable()
export class AppService {

    async test() {
        if (!TEST_PATH || TEST_PATH.length == 0) {
            console.log(`No TEST_PATH value provided!`);
        };


        // Multer File Object
        const fileFromPath: Express.Multer.File = await easyfiles.fileObject(TEST_PATH);
        fileFromPath
            ? console.log(`Test file object successfully created`)
            : console.log(`Unnable to create test file object`);

        // Data Urls
        /* const dataUrlFromFile: unknown = await easyfiles.dataUrl(fileFromPath);
        console.log(`dataUrlFromFile: ${dataUrlFromFile}`); */
        /* const dataUrlFromPath: unknown = await easyfiles.dataUrl(TEST_PATH);
        console.log(`dataUrlFromPath: ${dataUrlFromPath}`); */


        // Base 64
        /* const base64FromFile: string = await easyfiles.base64(fileFromPath);
        console.log(`base64FromFile: ${base64FromFile}`); */
        /* const base64FromPath: string = await easyfiles.base64(TEST_PATH);
        console.log(`base64FromPath: ${base64FromPath}`); */


        // Exists
        /* const existFile: boolean = await easyfiles.exists(fileFromPath);
        console.log(`existFile: ${existFile}`); */
        /* const existFilePath: boolean = await easyfiles.exists(`C:/Users/Santi/Pictures/pizza.jpeg`);
        console.log(`existFilePath: ${existFilePath}`); */


        // Storage
        /* const saveFromFile: boolean = await easyfiles.save(fileFromPath, 'C:/Users/Santi/Pictures');
        console.log(`saveFromFile: ${saveFromFile}`); */
        /* const saveFromPath: boolean = await easyfiles.save('C:/Users/Santi/Downloads/pizza.jpeg', 'C:/Users/Santi/Pictures');
        console.log(`saveFromPath: ${saveFromPath}`); */


        // Remove
        /* const deleteFromFile: boolean = await easyfiles.remove(fileFromPath);
        console.log(`deleteFromFile: ${deleteFromFile}`); */
        /* const deleteFromPath: boolean = await easyfiles.remove('C:/Users/Santi/Pictures/pizza.jpeg');
        console.log(`deleteFromPath: ${deleteFromPath}`); */
    }
}
