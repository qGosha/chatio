import React, { Fragment } from "react";
import { Segment, Icon, Ref } from 'semantic-ui-react';
import Messages from '../components/Messages';

const styles = {
  dialog: {
    height: '350px',
    overflowY: 'scroll',
    padding: '10px'
  },
}

const ChatSection = (props) => {
  const { dashboard, auth, handleDialogScroll, handleRef } = props;
  const { currentMessages } = dashboard;
  const user = auth.user;

  return (
  <div style={{gridArea: 'main'}}>
   <Fragment>
    <Icon name='times'/>
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
