import React, { useState, Fragment } from "react";
import {Segment, Image, Label, Icon, Transition} from "semantic-ui-react";
import Media from 'react-media';

const styles = {
  container: {
    width: "80px",
    height: "100%",
    fontFamily: "Roboto, sans-serif"
  },
  img_block: {
    marginBottom: "7px",
    textAlign: "center",
    cursor: "pointer"
  },
  img: {
    width: "3em",
    height: "3em"
  },
  indicator: {
    position: "absolute",
    width: "10px",
    height: "10px",
    borderRadius: "100%",
    bottom: "50%",
    left: "0"
  },
  username: {
    fontWeight: 600,
    fontSize: "13px",
    wordBreak: "break-all"
  },
  angle: {
    position:'fixed',
    top: '50%',
    left: 0,
    width: '15px',
    backgroundColor: '#ded7d7',
    height: '30px',
    borderBottomRightRadius: '15px',
    borderTopRightRadius: '15px'
  },
  angleIcon: {
    position:'absolute',
    top: '5px'
  }
};

const SidePanel = ({dashboard, openDialog, standartImage}) => {
  const [visible, changeVisible] = useState(true);
  const {iHaveDialogWith, allUsers, newMsgNotifictions} = dashboard;
  if (!allUsers) return null;
  const avatars =
    iHaveDialogWith &&
    iHaveDialogWith.map(friend => {
      const user = allUsers[friend];
      const photo = user && user.photos[0];
      const notifications = newMsgNotifictions[friend];
      const withNotificationStyles = {
        border: notifications ? "3px solid red" : "none"
      };
      return (
        <div
          key={user ? user._id : friend}
          style={styles.img_block}
          onClick={() => openDialog(user ? user._id : friend)}
        >
          <div style={{position: "relative"}}>
            <Image
              src={photo ? photo : standartImage}
              style={{...styles.img, ...withNotificationStyles}}
              avatar
            />
            {notifications ? (
              <Label color="red" floating circular size="tiny">
                {notifications}
              </Label>
            ) : null}
            {user ? (
              <div
                style={{
                  ...styles.indicator,
                  backgroundColor: user.online ? "green" : "red"
                }}
              />
            ) : null}
          </div>
          <span style={styles.username}>{user ? user.name : "Deleted"}</span>
        </div>
      );
    });

  return (
    <Media query="(max-width: 599px)">
        {matches =>
          matches ? (
            <Transition.Group animation='slide right' duration={500} style={{zIndex: "10", position:'fixed', top:0, bottom: 0}}>
                {visible ? <Segment style={styles.container}>{avatars}</Segment>  : null }
                 <Fragment>
                <div style={styles.angle} onClick={() =>changeVisible(!visible)}>
                 <Icon name='angle right' style={styles.angleIcon}/>
                </div></Fragment>
            </Transition.Group>
          ) : (
            <div style={{gridArea: "menu", zIndex: "10"}}>
              <Segment style={styles.container}>{avatars}</Segment>
            </div>
          )
        }
      </Media>
  );
};

export default SidePanel;
