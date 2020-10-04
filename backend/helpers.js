const util = require('util');
const pdf = require('pdf-parse');
const { v4: uuidv4 } = require('uuid');


const cloudStorage = require('./config/cloud-storage');
const firestoreDB = require('./config/firestore');
const bucket = cloudStorage.bucket('extractify-soham') // should be your bucket name


/**
 * upload media to cloud storage
 */

exports.uploadMedia = ({ file }) => new Promise((resolve, reject) => {
  let { originalname, buffer } = file;
  modifiedName = new Date().getTime() + originalname.replace(/ /g, "_");
  const blob = bucket.file(modifiedName);
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = util.format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    resolve(publicUrl)
  })
  .on('error', (_error) => {
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
});

/**
 * Extract file from PDF
 */
exports.extractText = ({ file }) => new Promise((resolve, reject) => {
  const { buffer } = file;

  pdf(buffer).then(data => {
    resolve(data.text);
  }).catch(error => {
    reject(error);
  });
});

/**
 * Save Data in firestore
 */

exports.saveDataInFirestore = async ({ ...data }) => {
  try {

    let id = uuidv4();

    await firestoreDB.collection('pdfs').doc(id).set({
      id,
      ...data
    });
    
    return id;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

/**
 * Fetch multiple files based on ids
 */

exports.fetchFiles = async ({ files }) => {
  try {
    let promiseArr = [];

    //create promise array
    files.forEach(id => {
      let query = firestoreDB.collection('pdfs').doc(id)
      promiseArr.push(query.get());
    })

    //resolve all promise at once
    let data = await Promise.all(promiseArr);

    let finalData = [];

    data.forEach(d => {
      let result = d.data();
      if (result) {
        finalData.push(result);
      } 
    });

    return finalData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Generate Custom error message
 */
exports.getCustomErrorMessage = (error = {}, message = 'Something went wrong.') => {
  const result = {};

  result.status = false;
  result.message = message;
  result.data = null;
  result.error = error;

  return result;
};

/**
 * Generate Custom success message
 */

exports.getCustomSuccessMessage = (data = {}, message = 'Request completed successfully.') => {
  const result = {};

  result.status = true;
  result.message = message;
  result.data = data;
  result.error = null;

  return result;
};