import React, { Fragment } from "react";
import { Segment, Image } from 'semantic-ui-react'

const standartImage = 'https://react.semantic-ui.com/images/wireframe/square-image.png';

const styles = {
  messageContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '10px',
    alignItems: 'center'
  },
  avatar: {
    height: '40px',
    weight: '40px'
  },
  text: {
    wordBreak: 'break',
    marginLeft: '8px'
  }
}

const Messages = ({messages, friendOptions}) => {
  const message = messages && messages.map( item => {
    return(
      <div key={item._id} style={styles.messageContainer}>
       <Image src={standartImage} style={styles.avatar}/>
       <span style={styles.text}>{item.message && item.message.text}</span>
      </div>
    )
  })
 return message
}

export default Messages;
