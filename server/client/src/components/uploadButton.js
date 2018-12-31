import React from "react";
import ImageUploader from 'react-images-upload-demo';
import { Modal, Button } from 'semantic-ui-react';
import ModalWindow from '../components/modal';


const Uploader = ({open, onClose, onDrop, pictures}) => {
  const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })
}
  return (
    <ModalWindow
     open={open}
     size='large'
     onClose={onClose}
     headertext={'Upload image(s)'}
     contenttext={
             <ImageUploader
                  defaultImages={pictures}
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
