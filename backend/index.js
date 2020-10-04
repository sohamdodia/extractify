const { 
  uploadMedia, 
  extractText, 
  saveDataInFirestore, 
  fetchFiles, 
  getCustomErrorMessage, 
  getCustomSuccessMessage 
} = require('./helpers');
const { busboyMiddleware, corsMiddleware } = require('./middleware');


const withMiddleware = (middleware, handler) => {
  return function (req, res) {
    middleware(req, res, () => {
      handler(req, res);
    });
  }
}

/**
 * Function will store the file in the file cloud storage and extracted data into firestore
 * Steps
 * 1. Store the file into cloud storage
 * 2. Extract text from file
 * NOTE: Step 1 and 2 will run simultaneously
 * 3. store the file url and extracted data into firestore
 */
exports.uploadAndExtractFile = withMiddleware(busboyMiddleware, async (req, res) => {
  try {
    const file = req.files[0];
    
    //Get cloud storage url and extracted text
    const [fileUrl, text] = await Promise.all([
      uploadMedia({ file }),
      extractText({ file })
    ]);

    let name = file.originalname.replace(/ /g, "_");

    //save the data into firestore
    let id = await saveDataInFirestore({
      fileUrl,
      name,
      text
    });
    
    res.set('Access-Control-Allow-Origin', '*');

    return res.status(200).send(getCustomSuccessMessage({
      fileUrl, text, id, name
    }));
  } catch (error) {
    return res.status(500).send(getCustomErrorMessage());
  }
});

/**
 * Fetch multiple files from firestore
 */
exports.getFiles = withMiddleware(corsMiddleware, async (req, res) => {
  try {
    const { files } = req.body;
    const filesData = await fetchFiles({ files });

    return res.status(200).send(getCustomSuccessMessage(filesData));
  } catch (error) {
    return res.status(500).send(getCustomErrorMessage());
  }
})

exports.index = (req, res) => {
  switch (req.path) {
    case '/upload-extract-file':
      return this.uploadAndExtractFile(req, res)
    case '/files':
      return this.getFiles(req, res)
    default:
      res.send('function not defined')
  }
}