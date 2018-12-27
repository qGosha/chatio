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
    weight: '40px',
    borderRadius: '100%'
  },
  text: {
    wordBreak: 'break',
  }
}

const Messages = ({messages, dashboard, auth}) => {
  if(!dashboard || !auth || !messages.length) return null;
  const sortedMessages = messages.sort( (a, b) =>  {
    return new Date(a.timestamp) - new Date(b.timestamp)
  })
  const { activeDialogWith, allUsers } = dashboard;
  const { user } = auth;
  const myAvatar = user.photos.length ? user.photos[0].value : standartImage;
  const peer = allUsers.filter( user => user._id === activeDialogWith)[0];
  const peerAvatar = (peer && peer.photos.length) ? peer.photos[0].value : standartImage;

  const message = sortedMessages.map( item => {
    const mine = (item.sender === activeDialogWith) ? false : true;
    return(
      <div key={item._id} style={{...styles.messageContainer, justifyContent: mine ? 'flex-start' : 'flex-end' }}>
       <Image src={mine ? myAvatar : peerAvatar} style={{...styles.avatar, order: mine ? 0 : 1}}/>
       <span style={{...styles.text, marginLeft: mine ? '8px' : '0px', marginRight: mine ? '0px' : '8px'}}>{item.message && item.message.text}</span>
      </div>
    )
  })
 return message
}

export default Messages;
