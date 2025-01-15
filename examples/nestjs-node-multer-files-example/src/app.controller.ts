import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as easyfiles from '@sco-techlab/node-multer-files'; 

@Controller('node-multer-files')
export class AppController {

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async dummy(@UploadedFile() file: Express.Multer.File) {
    console.log(await easyfiles.base64(file));
    /* const fileFromPath: Express.Multer.File = await easyfiles.fileObject(``);
    fileFromPath
      ? console.log(`Controller! Test file object successfully created`)
      : console.log(`Controller! Unnable to create test file object`); */
  }
  
}
