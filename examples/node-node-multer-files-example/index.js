const http = require('http');
const easyfiles = require('@sco-techlab/node-multer-files');

const server = http.createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/node-multer-files') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 -> ${req.method}${req.url} not found!`);
        return;
    }

    const busboy = require('busboy');
    const bb = busboy({ headers: req.headers });
    
    bb.on('file', async (fieldname, file, filename, encoding, mimetype) => {
      const buffers = [];
      
      file.on('data', (data) => {
        buffers.push(data);
      });
      
      file.on('end', async () => {
        const fileBuffer = Buffer.concat(buffers);
        const fileObject = { buffer: fileBuffer, originalname: filename };
        
        console.log(await easyfiles.base64(fileObject));

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end();
      });
    });

    req.pipe(bb);
});

server.listen(3005, async () => {
    console.log('Backend starts in route http://localhost:3005');

    const TEST_PATH = '';
    if (!TEST_PATH || TEST_PATH.length == 0) {
        console.log(`No TEST_PATH value provided!`);
    };


    // Multer File Object
    const fileFromPath = await easyfiles.fileObject(TEST_PATH);
    fileFromPath
        ? console.log(`Test file object successfully created`)
        : console.log(`Unnable to create test file object`);

    // Data Urls
    /* const dataUrlFromFile = await easyfiles.dataUrl(fileFromPath);
    console.log(`dataUrlFromFile: ${dataUrlFromFile}`); */
    /* const dataUrlFromPath = await easyfiles.dataUrl(TEST_PATH);
    console.log(`dataUrlFromPath: ${dataUrlFromPath}`); */


    // Base 64
    /* const base64FromFile = await easyfiles.base64(fileFromPath);
    console.log(`base64FromFile: ${base64FromFile}`); */
    /* const base64FromPath = await easyfiles.base64(TEST_PATH);
    console.log(`base64FromPath: ${base64FromPath}`); */


    // Exists
    /* const existFile = await easyfiles.exists(fileFromPath);
    console.log(`existFile: ${existFile}`); */
    /* const existFilePath = await easyfiles.exists(`C:/Users/Santi/Pictures/pizza.jpeg`);
    console.log(`existFilePath: ${existFilePath}`); */


    // Storage
    /* const saveFromFile = await easyfiles.save(fileFromPath, 'C:/Users/Santi/Pictures');
    console.log(`saveFromFile: ${saveFromFile}`); */
    /* const saveFromPath = await easyfiles.save('C:/Users/Santi/Downloads/pizza.jpeg', 'C:/Users/Santi/Pictures');
    console.log(`saveFromPath: ${saveFromPath}`); */


    // Remove
    /* const deleteFromFile = await easyfiles.remove(fileFromPath);
    console.log(`deleteFromFile: ${deleteFromFile}`); */
    /* const deleteFromPath = await easyfiles.remove('C:/Users/Santi/Pictures/pizza.jpeg');
    console.log(`deleteFromPath: ${deleteFromPath}`); */
});

