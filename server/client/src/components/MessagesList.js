import React, {useState, Fragment} from "react";
import {Image, Icon, Segment} from "semantic-ui-react";
import ModalWindow from "../components/modal";
const moment = require("moment");

const styles = {
  container: {
    gridArea: "menu / main / main / main",
    overflowY: "scroll",
    maxHeight: "calc(100vh - 150px)",
    padding: "0 5px"
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid #e8e5e5"
  },
  img: {
    height: "40px",
    width: "40px",
    marginRight: "15px",
    alignSelf: "center"
  },
  messageContainer: {
    display: "flex",

    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    margin: "10px 0",
    cursor: "pointer"
  },
  name: {fontWeight: "bold"},
  messageText: {marginBottom: "5px"},
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    position: "relative"
  },
  date: {
    fontSize: "12px",
    whiteSpace: "nowrap",
    color: "#767676",
    marginRight: "20px"
  },
  times: {
    position: "absolute",
    right: "0px",
    fontSize: "12px"
  }
};

const MessagesList = ({dashboard, openDialog, removeConversation}) => {
  const {messagesForEveryContact, iHaveDialogWith} = dashboard;
  const [modalOpen, modalStatusChange] = useState(false);
  const [hoveredItem, changeHoveredItem] = useState(null);
  const [isTimesHovered, changeTimesHover] = useState(false);
  const [idForDeleting, changeIdForDeleting] = useState(null);
  const allMessages = {};
  Object.keys(messagesForEveryContact).forEach(key => {
    let m = messagesForEveryContact[key];
    allMessages[key] = m[m.length - 1];
  });
  const sortedMessagesKeys = Object.keys(allMessages)
    .filter(i => allMessages[i])
    .sort((a, b) => {
      return (
        new Date(allMessages[b].timestamp) - new Date(allMessages[a].timestamp)
      );
    });
  const messages = sortedMessagesKeys.map(id => {
    const peer = iHaveDialogWith[id];
    const isImageMessage = allMessages[id].message.image.image;
    const timestamp = allMessages[id].timestamp;
    let date;
    if (moment(new Date()).isSame(timestamp, "day")) {
      date = moment(timestamp).format("h:mm a");
    } else {
      date = moment(timestamp).format("MMM D");
    }
    let message;
    if (isImageMessage) {
      message = <em>Image</em>;
    } else {
      const text = allMessages[id].message.text,
        width = window.innerWidth,
        standardLength = 38,
        standardWidth = 375,
        number = Math.floor((width / standardWidth) * standardLength);

      message = text.length > number ? text.slice(0, number - 3) + "..." : text;
    }
    const deleteIcon = (
      <Icon
        name="times"
        style={{
          ...styles.times,
          color: isTimesHovered && hoveredItem === id ? "black" : "#767676"
        }}
        onMouseEnter={() => changeTimesHover(true)}
        onMouseLeave={() => changeTimesHover(false)}
        onClick={e => {
          e.stopPropagation();
          changeIdForDeleting(id);
          modalStatusChange(true);
        }}
      />
    );
    let deleteSign;
    if (window.innerWidth > 780) {
      deleteSign = hoveredItem === id ? deleteIcon : null;
    } else {
      deleteSign = deleteIcon;
    }
    return (
      <div
        key={id}
        style={{
          ...styles.itemContainer,
          backgroundColor: hoveredItem === id ? "f5f7fa" : "inherit"
        }}
        onMouseEnter={() => changeHoveredItem(id)}
        onMouseLeave={() => changeHoveredItem(null)}
        onClick={() => openDialog(id)}
      >
        <Image style={styles.img} src={peer.photos[0]} />
        <div style={styles.messageContainer}>
          <div style={styles.contentContainer}>
            <span style={styles.name}>{peer.name}</span>
            <span style={styles.messageText}>{message}</span>
          </div>
          <div style={styles.date}>{date}</div>
          {deleteSign}
        </div>
      </div>
    );
  });
  return (
    <Fragment>
      <Segment style={styles.container}>{messages}</Segment>
      <ModalWindow
        open={modalOpen}
        onClose={() => modalStatusChange(false)}
        headertext={"Delete dialog"}
        contenttext={
          "Are you sure you want to delete dialog with this user? This can't be undone."
        }
        onNegative={() => modalStatusChange(false)}
        onPositive={() => removeConversation(idForDeleting)}
      />
    </Fragment>
  );
};

export default MessagesList;
