import React, { Fragment } from "react";
import { Segment, Image } from 'semantic-ui-react'
const moment = require('moment');

const standartImage = 'https://react.semantic-ui.com/images/wireframe/square-image.png';

const styles = {
  messageContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '10px',
    alignItems: 'center',
    overflowX: 'hidden'
  },
  avatar: {
    height: '40px',
    weight: '40px',
    borderRadius: '100%'
  },
  text: {
    wordBreak: 'break',
  },
  timestamp: {
    fontSize: '9px',
    color: 'gray'
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
  let shouldUseAvatar = true;
  let lastMessageFrom = sortedMessages[0].sender;

  const message = sortedMessages.map( (item, i) => {
    if (lastMessageFrom === item.sender && i) {
      shouldUseAvatar = false;
    } else {
      shouldUseAvatar = true;
      lastMessageFrom = item.sender;
    }
    const mine = (item.sender === activeDialogWith) ? false : true;
    const dynamicTexStyle = {
      marginLeft: shouldUseAvatar ? '8px' : '48px',
    }
    return(
      <div key={item._id} style={styles.messageContainer}>
       { shouldUseAvatar ? <Image src={mine ? myAvatar : peerAvatar} style={styles.avatar}/> : null }
       <div style={{...styles.text, ...dynamicTexStyle}}>
         <div>{item.message && item.message.text}</div>
         <span style={styles.timestamp}>{moment(item.timestamp).format('HH:mm')}</span>
       </div>
      </div>
    )
    // const dynamicTexStyle = {
    //   marginLeft: mine ? '8px' : '0px',
    //   marginRight: mine ? '0px' : '8px',
    //
    // }
    // return(
    //   <div key={item._id} style={{...styles.messageContainer, justifyContent: mine ? 'flex-start' : 'flex-end' }}>
    //    { shouldUseAvatar ? <Image src={mine ? myAvatar : peerAvatar} style={{...styles.avatar, order: mine ? 0 : 1}}/> : null }
    //    <div style={{...styles.text, ...dynamicTexStyle}}>
    //      <div>{item.message && item.message.text}</div>
    //      <span style={styles.timestamp}>{moment(item.timestamp).format('MMMM-do HH:mm')}</span>
    //    </div>
    //   </div>
    // )
  })
 return message;
}

export default Messages;
