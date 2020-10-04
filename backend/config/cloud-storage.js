const Cloud = require('@google-cloud/storage');
const path = require('path');
const serviceKey = path.join(__dirname, './cloudStorageKeys.json');

const { Storage } = Cloud
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'extractify-291404',
});

module.exports = storage;