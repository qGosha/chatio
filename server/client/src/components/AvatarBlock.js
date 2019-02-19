import React from "react";
import { Image, Icon } from 'semantic-ui-react';

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
    const online = allUsers && allUsers[user._id].online;
    const alone = (
      <div>
        <h2>
         {`Hello ${user.name}`}
        </h2>
        <Image alt='profile photo' src={user.photos.length ? user.photos[0] : standartImage} size='tiny' bordered />
        <span style={{fontWeight: 'bold'}}>My status: <span style={{color: online ? 'green' : 'red'}}>{ online ? 'Online' : 'Offline'}</span></span>
     </div>
   );
   const chatWith = activeDialogWith && (
       <div style={styles.chatImg}>
        <div>
         <Image alt='profile photo' src={user.photos.length ? user.photos[0] : standartImage} size='mini' bordered />
        </div>
        <Icon name="angle double right" style={styles.icon}/>
        <div>
         <Image alt='profile photo' src={peer.photos.length ? peer.photos[0] : standartImage} size='mini' bordered />
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
