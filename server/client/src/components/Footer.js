import React from "react";
import {Input, Button} from "semantic-ui-react";

const styles = {
  footer: {
    gridColumn: "2 / 5"
  }
};

const Footer = props => {
  const {
    onSubmit,
    messageText,
    onChange,
    handleSendClick,
    handleImageSendClick
  } = props;
  return (
    <form style={styles.footer} onSubmit={onSubmit}>
      <div style={{display: "flex"}}>
        <Input
          value={messageText}
          fluid
          placeholder="Send..."
          onChange={onChange}
          style={{flexGrow: 1}}
        />
        <Button primary onClick={handleSendClick}>
          Send
        </Button>
        <Button icon="attach" onClick={handleImageSendClick} />
      </div>
    </form>
  );
};

export default Footer;
