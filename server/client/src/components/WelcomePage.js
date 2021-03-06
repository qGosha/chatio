import React, { Fragment } from "react"
import { Segment, Image } from "semantic-ui-react"
import { Redirect } from "react-router"

const styles = {
  container: {
    width: "100%",
    gridArea: "main",
    height: "350px",
    overflowY: "scroll",
    padding: "10px"
  },
  img_block: {
    textAlign: "center",
    cursor: "pointer",
    marginRight: "6px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  img: {
    width: "3em",
    height: "3em"
  },
  imgContainer: {
    display: "flex",
    justifyContent: "center"
  },
  cont: {
    width: "3em",
    height: "3em",
    position: "relative"
  },
  indicator: {
    position: "absolute",
    width: "10px",
    height: "10px",
    borderRadius: "100%",
    bottom: "50%",
    left: "0"
  },
  welcomeText: {
    fontSize: "15px",
    textAlign: "center",
    fontFamily: "Roboto",
    fontWeight: 600,
    marginBottom: "10px"
  }
}

const WelcomePage = ({
  randomUsers,
  openDialog,
  standartImage,
  activeDialogWith
}) => {
  if (!randomUsers) return null
  if (activeDialogWith) {
    return <Redirect to="/dashboard/chat" />
  }
  const avatars = randomUsers.map(user => {
    const photo = user.photos[0]
    return (
      <div
        key={user._id}
        style={styles.img_block}
        onClick={() => openDialog(user._id)}
      >
        <div style={styles.cont}>
          <Image
            src={photo ? photo : standartImage}
            style={styles.img}
            avatar
          />
          <div
            style={{
              ...styles.indicator,
              backgroundColor: user.online ? "green" : "red"
            }}
          />
        </div>
        <span>{user.name}</span>
      </div>
    )
  })
  return (
    <Fragment>
      <Segment style={styles.container}>
        <div style={styles.welcomeText}>
          Choose a person you want to talk to:
        </div>
        <div style={styles.imgContainer}>{avatars}</div>
      </Segment>
    </Fragment>
  )
}

export default WelcomePage
