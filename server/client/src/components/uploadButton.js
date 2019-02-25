import React from "react";
import ImageUploader from "react-images-upload";
import {Button, Divider} from "semantic-ui-react";

const Uploader = ({onClose, onDrop, visible, onUpload}) => {
  return (
    <div
      style={{
        display: visible ? "block" : "none",
        width: "100vw",
        height: "100vh",
        position: "absolute",
        zIndex: "100",
        backgroundColor: "#fff"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          padding: "10px"
        }}
      >
        <Button.Group style={{marginRight: "10px"}}>
          <Button onClick={onClose}>Cancel</Button>
          <Button.Or />
          <Button positive onClick={onUpload}>
            Upload
          </Button>
        </Button.Group>
      </div>
      <Divider />
      <ImageUploader
        withIcon={true}
        buttonText="Choose images"
        onChange={onDrop}
        imgExtension={[".jpg", ".gif", ".png", ".gif"]}
        maxFileSize={5242880}
        withPreview={true}
      />
    </div>
  );
};

export default Uploader;
