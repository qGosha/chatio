import React, { Fragment } from "react";
import { Segment, Icon, Ref } from 'semantic-ui-react';
import Messages from '../components/Messages';
import { useState, useEffect } from 'react';

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
  const { dashboard, auth, handleDialogScroll, handleRef, closeDialog, markMsgRead, removeNotifications } = props;
  const { currentMessages, activeDialogWith, newMsgNotifictions } = dashboard;
  const user = auth.user;
  const notReadMsg = currentMessages.some( msg => msg.recipient === user._id && !msg.read );
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
  }, [activeDialogWith]);
  return (
  <div style={{gridArea: 'main'}}>
   <Fragment>
    <Icon name='times' style={styles.close} onClick={closeDialog}/>
    <Ref innerRef={handleRef}>
     <Segment style={styles.dialog} onScroll={handleDialogScroll}>
       <Messages messages={currentMessages} dashboard={dashboard} auth={auth}/>
     </Segment>
    </Ref>
   </Fragment>
  </div>
  )
}

export default ChatSection;