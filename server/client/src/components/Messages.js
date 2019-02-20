import React, { Fragment } from "react";
import { Image, Divider } from 'semantic-ui-react';

const moment = require('moment');

const styles = {
  messageContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '10px',
    alignItems: 'center',
    overflowX: 'hidden'
  },
  avatar: {
    height: '3em',
    width: '3em',
  },
  text: {
    wordBreak: 'break',
  },
  timestamp: {
    fontSize: '9px',
    color: 'gray'
  },
  image: {
    maxWidth: '300px',
    maxHeight: '300px'
  }
}

const Messages = ({messages, dashboard, auth, standartImage}) => {
  if(!dashboard || !auth || !messages.length) return null;
  const sortedMessages = messages.sort( (a, b) =>  {
    return new Date(a.timestamp) - new Date(b.timestamp)
  })
  const { activeDialogWith, allUsers } = dashboard;
  const { user } = auth;
  const myAvatar = user.photos.length ? user.photos[0] : standartImage;
  const peer = allUsers[activeDialogWith];
  const peerAvatar = (peer && peer.photos.length) ? peer.photos[0] : standartImage;
  let shouldUseAvatar = true;
  let lastMessageFrom = sortedMessages[0].sender;
  let currentDate = 0;
  const message = sortedMessages.map( (item, i) => {
    if (lastMessageFrom === item.sender && i) {
      shouldUseAvatar = false;
    } else {
      shouldUseAvatar = true;
      lastMessageFrom = item.sender;
    }
    const formattedDate = moment(item.timestamp).format('YYYY-MM-DD');

    const shouldShowDivider = (currentDate !== formattedDate) ? true : false;
    currentDate = formattedDate;
    const mine = (item.sender === activeDialogWith) ? false : true;
    const dynamicTexStyle = {
      marginLeft: shouldUseAvatar ? '8px' : '48px',
    }

    const dynamicImageStyle = {
      width: '300px',
      height: '300px',
    };
    const imgS = {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
    const content = item.message.image.image ?
    <div style={dynamicImageStyle}><Image style={imgS} src={item.message.text ? item.message.text : standartImage}/></div>
    : <div>{item.message && item.message.text}</div>;
    return(
      <Fragment key={item._id}>
        { shouldShowDivider ? <Divider horizontal><span style={styles.timestamp}>{currentDate}</span></Divider> : null }
        <div style={{...styles.messageContainer, backgroundColor: item.read ? '#fff' : 'beige'}}>
         { shouldUseAvatar ? <Image src={mine ? myAvatar : peerAvatar} style={styles.avatar} avatar/> : null }
         <div style={{...styles.text, ...dynamicTexStyle}}>
           { content }
           <span style={styles.timestamp}>{moment(item.timestamp).format('HH:mm')}</span>
         </div>
        </div>
      </Fragment>
    )
  })
 return message;
}

export default Messages;
