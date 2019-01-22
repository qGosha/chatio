import React, { Fragment } from "react";
import { Segment, Image } from 'semantic-ui-react'

const standartImage = 'https://react.semantic-ui.com/images/wireframe/square-image.png';

const styles = {
  container: {
    width: '75px',
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
  }
}

const SidePanel = ({friendOptions, allUsers, openDialog}) => {
    const avatars = friendOptions && friendOptions.map( friend => {
      const user = allUsers[friend];
      const photos = user.photos[0];
      return (
        <div key={user._id} style={styles.img_block} onClick={() => openDialog(user._id)}>
          <div style={{ position: 'relative' }}>
            <Image src={photos ? photos.value : standartImage} style={styles.img} avatar />
            <div style={{ ...styles.indicator, backgroundColor: user.online ? 'green' : 'red' }}></div>
          </div>
          <span>{user.name}</span>
        </div>
      )
    })

  return (
    <div style={{gridArea: 'menu'}}>
     <Segment style={styles.container}>
       {avatars}
     </Segment>
    </div>
  )
}


export default SidePanel;
