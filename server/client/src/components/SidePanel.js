import React, { Fragment } from "react";
import { Segment, Image } from 'semantic-ui-react'

const standartImage = 'https://react.semantic-ui.com/images/wireframe/square-image.png';

const styles = {
  container: {
    width: '75px',
    height: '100%',
    // margin: '5% 0 5% 0'
  },
  img_block: {
    marginBottom: '7px',
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative'
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
    bottom: '35%',
    left: '45%'
  }
}

const SidePanel = ({friendOptions, openDialog}) => {
    const avatars = friendOptions && friendOptions.map( user => {
      const photos = user.photos[0];
      return (
        <div key={user._id} style={styles.img_block} onClick={() => openDialog(user._id)}>
          <Image src={photos ? photos.value : standartImage} style={styles.img} avatar />
          <div style={{ ...styles.indicator, backgroundColor: user.online ? 'green' : 'red' }}></div>
          <span>{user.name}</span>
        </div>
      )
    })

  return (
     <Segment style={styles.container}>
       {avatars}
     </Segment>
  )
}


export default SidePanel;
