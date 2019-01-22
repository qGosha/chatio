import React from "react";
import { Input, Image, Button } from 'semantic-ui-react';

const styles = {
  footer: {
    gridArea: 'footer',
    display: 'grid',
    gridTemplateColumns: '5fr 1fr 1fr',
    gridTemplateRows: '0.4fr'
  }
}

const Footer = (props) => {
  const { onSubmit, messageText, onChange, handleSendClick, handleImageSendClick } = props;
  return (
    <form style={styles.footer} onSubmit={onSubmit}>
     <Input value={messageText} fluid placeholder='Send...' onChange={onChange}/>
     <Button onClick={handleSendClick}>Send</Button>
     <Button icon='attach' onClick={handleImageSendClick} />
   </form>
  )
}

export default Footer;
