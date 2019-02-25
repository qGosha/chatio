import React, { useState } from "react";
import {TextArea, Button, Icon} from "semantic-ui-react";

const styles = {
  footer: {
    gridColumn: "2 / 5"
  },
  area: {
    transition: 'border-bottom-color 0.3s linear',
    maxHeight: '200px',
    width: '100%',
    paddingRight: '60px',
    borderRadius: '6px',
    outline: 0
  },
  icon: {
    position: 'absolute',
    right: '30px',
    bottom:'5px',
    cursor: 'pointer'
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
  const defaultColor = {
    color: '#394ce2'
  }
  const hoverColor = {
    color: '#838ac3'
  }
  const [iconHoverSend, changeIconHoverSend] = useState(defaultColor);
  const [iconHoverAttach, changeIconHoverAttach] = useState(defaultColor);

  return (
    <form style={styles.footer} onSubmit={onSubmit}>
       <div style={{position: 'relative'}}>
        <TextArea
          value={messageText}
          placeholder="Type your message..."
          onChange={onChange}
          style={styles.area}
          autoHeight
        />
        <Icon
        onMouseEnter={() => changeIconHoverSend(hoverColor)}
        onMouseLeave={() => changeIconHoverSend(defaultColor)}
        name='send'
        onClick={handleSendClick}
        size='large'
        style={{...styles.icon, ...iconHoverSend}}
        />
        <Icon
        name="camera"
        onClick={handleImageSendClick}
        size='large'
        style={{...styles.icon, ...iconHoverAttach, right: 0}}
        onMouseEnter={() => changeIconHoverAttach(hoverColor)}
        onMouseLeave={() => changeIconHoverAttach(defaultColor)}
        />
        </div>
    </form>
  );
};

export default Footer;
