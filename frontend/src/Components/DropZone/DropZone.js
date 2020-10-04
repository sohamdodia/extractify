import React, { useRef } from 'react';
import './DropZone.css';

const DropZone = (props) => {

  const fileInputRef = useRef();

  const dragOver = (e) => {
    e.preventDefault();
  }

  const dragEnter = (e) => {
    e.preventDefault();
  }

  const dragLeave = (e) => {
    e.preventDefault();
  }

  const fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      props.handleFiles(files);
    }
  }

  const fileInputClicked = () => {
    fileInputRef.current.click();
  }

  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
        props.handleFiles(fileInputRef.current.files);
    }
  } 
  return (
    <div className="container">
      <div
        className="drop-container"
        onDragOver={dragOver}
        onDragEnter={dragEnter}
        onDragLeave={dragLeave}
        onDrop={fileDrop}
        onClick={fileInputClicked}
      >
        <div className="drop-message">
          <div className="upload-icon"></div>
           Drag & Drop files here or click to upload
        </div>
        <input
          ref={fileInputRef}
          className="file-input"
          type="file"
          multiple
          accept="application/pdf"
          onChange={filesSelected}
        />
      </div>
    </div>
  )
}

export default DropZone;