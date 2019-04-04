import React, {Fragment} from "react";
import {Segment, Icon, Ref} from "semantic-ui-react";
import Messages from "../components/Messages";
import {useEffect} from "react";
import history from "../helpers/history";

const styles = {
  dialog: {
    overflowY: "scroll",
    padding: "10px"
  },
  close: {
    cursor: "pointer"
  }
};

const ChatSection = props => {
  const {
    dashboard,
    auth,
    handleDialogScroll,
    handleRef,
    closeDialog,
    markMsgRead,
    removeNotifications,
    standartImage,
    topStyle
  } = props;
  const {messagesForEveryContact, activeDialogWith, newMsgNotifictions} = dashboard;
  const user = auth.user;
  const currentMessages = messagesForEveryContact[activeDialogWith];
  const notReadMsg = currentMessages.some(
    msg => msg.recipient === user._id && !msg.read
  );
  let dialog;
  const assignRef = element => {
    dialog = element;
    handleRef(element);
  };
  useEffect(
    () => {
      if (notReadMsg) {
        let timer = setTimeout(() => {
          let ids = [];
          currentMessages.forEach(msg => {
            if (msg.recipient === user._id && !msg.read) {
              ids.push(msg._id);
            }
          });
          if (newMsgNotifictions[activeDialogWith]) {
            removeNotifications(activeDialogWith);
          }
          markMsgRead(ids, activeDialogWith);
        }, 1000);
        return () => clearTimeout(timer);
      }
      if (dialog) {
        dialog.scrollTop = dialog.scrollHeight;
      }
    },
    [activeDialogWith]
  );
  return (
    <div style={{gridArea: "main"}}>
      <Fragment>
        <Icon name="times" style={styles.close} onClick={() => {
          history.goBack();
          closeDialog();
        }} />
        <Ref innerRef={assignRef}>
          <Segment style={{...styles.dialog, ...topStyle.chatWindow}} onScroll={handleDialogScroll}>
            <Messages
              messages={currentMessages}
              dashboard={dashboard}
              standartImage={standartImage}
              auth={auth}
              dynamicImageStyle={topStyle.dynamicImageStyle}
            />
          </Segment>
        </Ref>
      </Fragment>
    </div>
  );
};

export default ChatSection;
