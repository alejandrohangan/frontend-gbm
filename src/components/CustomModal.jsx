import React from 'react';
import { Modal } from 'react-bootstrap';

function CustomModal({ show, handleClose, title, children, size = 'lg', fullscreen = false }) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size={size}
      fullscreen={fullscreen}
      centered
      backdrop="static"
      animation={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
  );
}

export default CustomModal;