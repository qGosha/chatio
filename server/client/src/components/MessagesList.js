import React from "react";
import {Image, Divider, Segment, Item} from "semantic-ui-react";
const moment = require("moment");

const styles = {
  container: {
    gridArea: 'menu / main / main / main',
    overflowY: 'scroll',
    maxHeight: 'calc(100vh - 150px)',
    padding: '5px'
  },
}

const MessagesList = ({dashboard}) => {
  const {messagesForEveryContact, iHaveDialogWith} = dashboard;
  const allMessages = {};
  Object.keys(messagesForEveryContact).forEach( key => {
    let m = messagesForEveryContact[key];
    allMessages[key] = m[m.length - 1] || [];
  });
  // const messages = Object.keys(allMessages).map( id => {
  //   let peer = iHaveDialogWith[id];
  //   return (
  //     <Item key={id}>
  //       <Image size='mini' src={peer.photos[0]} />
  //       <Item.Content>
  //         <Item.Header>{peer.name}</Item.Header>
  //         <Item.Description>{'Message'}</Item.Description>
  //       </Item.Content>
  //     </Item>
  //   )
  // })
  const messages = Object.keys(allMessages).map( id => {
    let peer = iHaveDialogWith[id];
    return (
      <div key={id} style={{display: 'flex', flexDirection: 'row', padding: '5px'}}>
        <Image
        style={{height: '40px', width: '40px', marginRight: '15px'}}
        src={peer.photos[0]}
        />
        <div style={{display: 'flex', flexDirection: 'column', borderBottom: '1px solid #e8e5e5',
    width: '100%'}}>
          <span style={{fontWeight: 'bold'}}>{peer.name}</span>
          <span style={{marginBottom: '5px'}}>{'Message'}</span>
        </div>
      </div>
    )
  })
  return (
    <Segment style={styles.container}>
        {messages}
    </Segment>
  )
};

export default MessagesList;
