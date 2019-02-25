import React, { Fragment } from "react";
import { Segment, Icon, Ref } from 'semantic-ui-react';
import Messages from '../components/Messages';
import { useEffect } from 'react';

const styles = {
  dialog: {
    height: '350px',
    overflowY: 'scroll',
    padding: '10px'
  },
  close: {
    cursor: 'pointer'
  }
}

const ChatSection = (props) => {
  const { dashboard, auth, handleDialogScroll, handleRef, closeDialog, markMsgRead, removeNotifications, standartImage, dynamicImageStyle } = props;
  const { currentMessages, activeDialogWith, newMsgNotifictions } = dashboard;
  const user = auth.user;
  const notReadMsg = currentMessages.some( msg => msg.recipient === user._id && !msg.read );
  let dialog;
  const assignRef = element => {
    dialog = element;
    handleRef(element);
  }
  useEffect( () => {
    if (notReadMsg) {
      let timer = setTimeout(() => {
       let ids = [];
       const updatedMsg = currentMessages.map( msg => {
        if (msg.recipient === user._id && !msg.read) {
          msg.read = true;
          ids.push(msg._id);
        }
        return msg;
      });
      if (newMsgNotifictions[activeDialogWith]) {
        removeNotifications(activeDialogWith);
      }
      markMsgRead(ids, updatedMsg, activeDialogWith);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (dialog) {
     dialog.scrollTop = dialog.scrollHeight;
    }
  }, [activeDialogWith]);
  return (
  <div style={{gridArea: 'main'}}>
   <Fragment>
    <Icon name='times' style={styles.close} onClick={closeDialog}/>
    <Ref innerRef={assignRef}>
     <Segment style={styles.dialog} onScroll={handleDialogScroll}>
       <Messages messages={currentMessages} dashboard={dashboard} standartImage={standartImage} auth={auth} dynamicImageStyle={dynamicImageStyle}/>
     </Segment>
    </Ref>
   </Fragment>
  </div>
  )
}

export default ChatSection;
