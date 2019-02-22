import React from "react";
import { Segment, Image, Label } from 'semantic-ui-react'

const standartImage = 'https://react.semantic-ui.com/images/wireframe/square-image.png';

const styles = {
  container: {
    width: '80px',
    height: '100%',
  },
  img_block: {
    marginBottom: '7px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  img: {
    width: '3em',
    height: '3em',
  },
  indicator: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    borderRadius: '100%',
    bottom: '50%',
    left: '0'
  },
  username: {
    wordBreak: 'break-all'
  }
}

const SidePanel = ({dashboard, openDialog}) => {
    const { iHaveDialogWith, allUsers, newMsgNotifictions } = dashboard;
    if (!allUsers) return null;
    const avatars = iHaveDialogWith && iHaveDialogWith.map( friend => {
      const user = allUsers[friend];
      // if (!user) return null;
      const photo = user && user.photos[0];
      const notifications = newMsgNotifictions[friend];
      const withNotificationStyles = {
        border: notifications ? '3px solid red' : 'none'
      }
      return (
        <div key={ user ? user._id : friend } style={styles.img_block} onClick={() => openDialog(user ? user._id : friend)}>
          <div style={{ position: 'relative' }}>
            <Image src={photo ? photo : standartImage} style={{...styles.img, ...withNotificationStyles}} avatar />
            { notifications ? <Label color='red' floating circular size='tiny'>{notifications}</Label> : null }
            { user ? <div style={{ ...styles.indicator, backgroundColor: user.online ? 'green' : 'red' }}></div> : null }
          </div>
          <span style={styles.username}>{user ? user.name : 'Deleted'}</span>
        </div>
      )
    })

  return (
    <div style={{gridArea: 'menu', zIndex: '10'}}>
     <Segment style={styles.container}>
       {avatars}
     </Segment>
    </div>
  )
}


export default SidePanel;
