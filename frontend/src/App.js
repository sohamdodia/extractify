import React, { Component } from 'react';
import './App.css';
import DropZone from './Components/DropZone/DropZone';
import Files from './Components/Files/Files';
import ExtractedFiles from './Components/ExtractedFiles/ExtractedFiles'
import Modal from './Components/Modal/Modal';
import * as API from './services/api';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFiles: [],
      extractedFiles: [],
      displayModal: false,
      selectedFile: null,
      loading: false
    }
  }

  async componentDidMount() {
    let ids = localStorage.getItem("fileIds");
    if (ids) {
      ids = JSON.parse(ids);
      let r = await API.post({
        url: '/files',
        data: { files: ids },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      this.setState({
        extractedFiles: r.data
      })

    }
  }

  validateFiles = (file) => {
    const validTypes = ['application/pdf'];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  }

  removeFile = (name) => {
    let { currentFiles } = this.state;
    currentFiles = currentFiles.filter(file => file.name !== name);
    this.setState({
      currentFiles
    });
  }

  handleFiles = (files) => {
    const { currentFiles } = this.state;
    for (let i = 0; i < files.length; i++) {
      if (this.validateFiles(files[i])) {
        files[i].isValid = true;
      } else {
        files[i].isValid = false;
      }
    }
    this.setState({
      currentFiles: currentFiles.concat(...files)
    });

  }

  handleUpload = async () => {
    const { currentFiles, extractedFiles: oldFiles } = this.state;
    if (!currentFiles.length) {
      alert('Please choose atleast one file!');
      return;
    }

    this.setState({
      loading: true
    })
    const validFiles = currentFiles.filter(file => file.isValid);
    let promiseArr = [];
    for (let i = 0; i < validFiles.length; i++) {
      let file = validFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      let p = API.post({
        url: '/upload-extract-file',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      promiseArr.push(p);
    }

    let promiseData = await Promise.all(promiseArr);
    let extractedFiles = [];
    let ids = [];
    for (let i = 0; i < promiseData.length; i++) {
      ids.push(promiseData[i].data.id)
      extractedFiles.push(promiseData[i].data)
    }

    let existingIds = localStorage.getItem('fileIds');
    if (existingIds) {
      existingIds = JSON.parse(existingIds);
      existingIds = existingIds.concat(...ids);
      localStorage.setItem('fileIds', JSON.stringify(existingIds));
    } else {
      localStorage.setItem('fileIds', JSON.stringify(ids))
    }
    this.setState({
      extractedFiles: oldFiles.concat(...extractedFiles),
      currentFiles: [],
      loading: false
    });
  }

  openModal = (data) => {
    this.setState({
      selectedFile: data,
      displayModal: true
    })
  }

  closeModal = () => {
    this.setState({
      selectedFile: null,
      displayModal: false
    });
  }

  render() {
    
    const { currentFiles, extractedFiles, displayModal, selectedFile, loading } = this.state;
    return (
      <div>
        <p className="title">Extractify</p>
        <div className="content">
          <DropZone handleFiles={this.handleFiles} />
          {
            !loading
              ? (<button
                className="file-upload-btn"
                onClick={() => this.handleUpload()}
              >
                Upload Files
              </button>
              ) : <h4 className="content-text">Please wait, files are being processed</h4>
          }

          {
            currentFiles.length
              ? (
                <Files
                  files={currentFiles}
                  removeFile={this.removeFile}
                />
              ) : <h4 className="content-text">No Selected Files</h4>
          }
          {
            extractedFiles.length > 0
              ? (
                <ExtractedFiles
                  files={extractedFiles}
                  openModal={this.openModal}
                />
              )
              : <h4 className="content-text">No Extracted Files yet</h4>

          }

          <Modal
            display={displayModal}
            closeModal={this.closeModal}
            file={selectedFile}
          />
        </div>
      </div>
    )
  }
}

export default App;
