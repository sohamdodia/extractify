import React, { Fragment } from 'react';
import './Modal.css';

const Modal = (props) => {
  return (
    <Fragment>
      {
        props.display
          ? (
            <div className="modal">
              <div className="overlay"></div>
              <span className="close" onClick={(() => props.closeModal())}>X</span>
              <div className="modal-data">
                <p className="content-text">{props.file.name}</p>
                <div className="modal-data-text">{props.file.text}</div>
              </div>
            </div>
          ): null

      }
    </Fragment>
  )
}

export default Modal;