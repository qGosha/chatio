import React from "react";
import ImageUploader from 'react-images-upload';
import { Modal, Button } from 'semantic-ui-react';
import ModalWindow from '../components/modal';


const Uploader = ({open, onClose, onDrop, pictures}) => {
  return (
    <ModalWindow
     open={open}
     size='large'
     onClose={onClose}
     headertext={'Upload image(s)'}
     contenttext={
             <ImageUploader
                  withIcon={true}
                  buttonText='Choose images'
                  onChange={onDrop}
                  imgExtension={['.jpg', '.gif', '.png', '.gif']}
                  maxFileSize={5242880}
                  withPreview={true}
              />
     }
     onNegative={onClose}
     onPositive={onClose}
     />
  )
}

export default Uploader;
