import React from 'react';

const ExtractedFiles = (props) => {
  
  const fileType = (fileName) => {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
  }

  return (
    <div className="file-display-container">
    <h4 className="content-text">All the extracted files</h4>
      {
        props.files.map((data, i) =>
          <div className="file-status-bar" key={i}>
            <div>
              <div className="file-type-logo"></div>
              <div className="file-type">{fileType(data.name)}</div>
              <div className="file-name" onClick={() => props.openModal(data)}>
                {data.name}
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default ExtractedFiles;