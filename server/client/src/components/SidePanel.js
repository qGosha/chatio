import React, { useState } from "react"
import { Segment, Image, Label, Icon, Transition } from "semantic-ui-react"
import Media from "react-media"

const styles = {
  container: {
    width: "80px",
    height: "100%",
    fontFamily: "Roboto, sans-serif",
    border: "none",
    boxShadow: "none"
  },
  img_block: {
    marginBottom: "7px",
    textAlign: "center",
    cursor: "pointer",
    borderBottom: "0.5px solid #e4dada"
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
    position: "fixed",
    top: "50%",
    left: 0,
    width: "15px",
    backgroundColor: "#ded7d7",
    height: "30px",
    borderBottomRightRadius: "15px",
    borderTopRightRadius: "15px"
  },
  angleIcon: {
    position: "absolute",
    top: "5px"
  },
  area: {
    gridArea: "menu",
    zIndex: "10",
    marginTop: "-8px"
  },
  mobileArea: {
    zIndex: "10",
    position: "fixed",
    top: 0,
    bottom: 0
  }
}

const SidePanel = ({ dashboard, openDialog, standartImage }) => {
  const [visible, changeVisible] = useState(false)
  const {
    iHaveDialogWith,
    newMsgNotifictions,
    sortedPeerListForSidePanel
  } = dashboard
  const avatars = sortedPeerListForSidePanel.length
    ? sortedPeerListForSidePanel.slice(0, 5).map((id, i) => {
        const friend = iHaveDialogWith[id]
        let deleted, photo, notifications
        if (!friend._id) {
          deleted = true
        } else {
          photo = friend.photos[0]
          notifications = newMsgNotifictions[id]
        }
        const withNotificationStyles = {
          border: notifications ? "3px solid red" : "none"
        }
        return (
          <div
            key={deleted ? i : id}
            style={styles.img_block}
            onClick={() => openDialog(id)}
          >
            <div style={{ position: "relative" }}>
              <Image
                src={photo ? photo : standartImage}
                style={{ ...styles.img, ...withNotificationStyles }}
                avatar
              />
              {notifications ? (
                <Label color="red" floating circular size="tiny">
                  {notifications}
                </Label>
              ) : null}
              {!deleted ? (
                <div
                  style={{
                    ...styles.indicator,
                    backgroundColor: friend.online ? "green" : "red"
                  }}
                />
              ) : null}
            </div>
            <span style={styles.username}>
              {!deleted ? friend.name : "Deleted"}
            </span>
          </div>
        )
      })
    : null

  const angleSwitch = (
    <div
      style={{ ...styles.angle, left: visible ? "80px" : 0 }}
      onClick={() => changeVisible(!visible)}
    >
      <Icon
        name={visible ? "angle left" : "angle right"}
        style={styles.angleIcon}
      />
    </div>
  )

  return (
    <Media query="(max-width: 599px)">
      {matches =>
        matches ? (
          <Transition.Group
            animation="slide right"
            duration={500}
            style={styles.mobileArea}
          >
            {visible ? (
              <div>
                <Segment style={styles.container}>{avatars}</Segment>
                {angleSwitch}
              </div>
            ) : null}
            {!visible ? angleSwitch : null}
          </Transition.Group>
        ) : (
          <div style={styles.area}>
            <Segment style={styles.container}>{avatars}</Segment>
          </div>
        )
      }
    </Media>
  )
}

export default SidePanel
