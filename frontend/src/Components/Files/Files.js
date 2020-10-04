import React from 'react';

import './Files.css'
const Files = (props) => {
  const errorMessage = 'File type not supported';

  const fileSize = (size) => {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const fileType = (fileName) => {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
  }

  return (
    <div className="file-display-container">
    <h4 className="content-text">Currently Selected Files</h4>
      {
        props.files.map((data, i) =>
          <div className="file-status-bar" key={i}>
            <div>
              <div className="file-type-logo"></div>
              <div className="file-type">{fileType(data.name)}</div>
              <span className={`file-name ${!data.isValid ? 'file-error' : ''}`}>{data.name}</span>
              <span className="file-size">({fileSize(data.size)})</span> {!data.isValid && <span className='file-error-message'>({errorMessage})</span>}
            </div>
            <div className="file-remove" onClick={() => props.removeFile(data.name)}>X</div>
          </div>
        )
      }
    </div>
  )
}

export default Files;