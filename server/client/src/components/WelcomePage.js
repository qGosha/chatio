import React, { Fragment } from "react";
import { Segment, Image } from 'semantic-ui-react'

const standartImage = 'https://react.semantic-ui.com/images/wireframe/square-image.png';


const styles = {
  container: {
    width: '100%',
    gridArea: 'main / main / main / main',
    height: '350px',
    overflowY: 'scroll',
    padding: '10px',
  },
  img_block: {
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  img: {
    width: '3em',
    height: '3em',
  },
  imgContainer: {
   display: 'flex',
  },
  cont: {
    width: '3em',
    height: '3em',
    position: 'relative'
  },
  indicator: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    borderRadius: '100%',
    bottom: '50%',
    left: '0'
  }
}


const WelcomePage = ({allUsers, auth, openDialog}) => {
    if (!allUsers) return null;
    const me = auth.user._id;
    const users = Object.values(allUsers).filter( i => i._id !== me);
    const avatars = users && users.map( user => {
      const photos = user.photos[0];
      return (
        <div key={user._id} style={styles.img_block} onClick={
          () => openDialog(user._id)
        }>
         <div style={styles.cont}>
          <Image src={photos ? photos.value : standartImage} style={styles.img} avatar />
          <div style={{ ...styles.indicator, backgroundColor: user.online ? 'green' : 'red' }}></div>
         </div>
          <span>{user.name}</span>
        </div>
      )
    })
    return (
    <Fragment>
      <Segment style={styles.container}>
       <div>Welcome to Messenger. Choose a person you want to talk to</div>
       <div style={styles.imgContainer}>{avatars}</div>
      </Segment>
    </Fragment>
    )
}

export default WelcomePage;
