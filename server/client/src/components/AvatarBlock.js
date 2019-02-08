import React from "react";
import { Segment, Image, Icon } from 'semantic-ui-react';

const standartImage = 'https://react.semantic-ui.com/images/wireframe/square-image.png';


const styles = {
  container: {
    width: '100%',
    gridArea: 'avatar / avatar / avatar / avatar'
  },
  chatImg: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  icon: {
    alignSelf: 'center',
    color: 'green'
  }
}

const AvatarBlock = ({allUsers, auth, activeDialogWith}) => {
   if(!allUsers) return null;
    const user = auth.user;
    const peer = allUsers[activeDialogWith];
    const alone = (
      <div>
        <h2>
         {`Hello ${user.name}`}
        </h2>
        <Image alt='profile photo' src={user.photos.length ? user.photos[0].value : standartImage} size='tiny' bordered />
        <span>My status: {allUsers && allUsers[user._id].online ? 'Online' : 'Offline'}</span>
     </div>
   );
   const chatWith = activeDialogWith && (
       <div style={styles.chatImg}>
        <div>
         <Image alt='profile photo' src={user.photos.length ? user.photos[0].value : standartImage} size='mini' bordered />
        </div>
        <Icon name="angle double right" style={styles.icon}/>
        <div>
         <Image alt='profile photo' src={peer.photos.length ? peer.photos[0].value : standartImage} size='mini' bordered />
        </div>
       </div>
   )
    return (
     <div style={styles.container}>
     { peer ? chatWith : alone }
   </div>
    )
}


export default AvatarBlock;
