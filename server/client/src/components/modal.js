import React from "react";
import { Modal, Button } from 'semantic-ui-react';

const ModalWindow = ({
  open,
  onClose,
  closeOnEscape,
  closeOnDimmerClick,
  headertext,
  contenttext,
  onNegative,
  onPositive,
  size,
  closeIcon
}) => {

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnEscape={closeOnEscape}
      closeOnDimmerClick={closeOnDimmerClick}
      size={size}
      closeIcon={closeIcon}
    >
      <Modal.Header>{headertext}</Modal.Header>
      <Modal.Content>
        <p>{contenttext}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => onNegative()} negative>
          No
        </Button>
        <Button
          onClick={() => onPositive()}
          positive
          labelPosition='right'
          icon='checkmark'
          content='Yes'
        />
      </Modal.Actions>
    </Modal>
  )
}

Modal.defaultProps = {
  closeOnEscape: true,
  closeOnDimmerClick: false,
  headertext: 'Confirmation',
  contenttext: 'Are you sure?',
  size: 'small',
  closeIcon: true
};

export default ModalWindow;
