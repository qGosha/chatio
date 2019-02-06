import React from "react";
import { Segment, Image, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const styles = {
  header: {
   display: 'flex',
   justifyContent: 'space-between'
 },
}

const PageHeader = (props) => {
  const { auth, allUsers, logout, sendMessage, openModal, standartImage, match } = props;
  const user = auth.user;
  return (
  <div style={{gridArea: 'header'}}>
    <div style={styles.header}>
     <div>
      <h2>
       {`Hello ${user.name}`}
      </h2>
      <Image alt='profile photo' src={user.photos.length ? user.photos[0].value : standartImage} size='tiny' bordered />
      <span>My status: {allUsers && allUsers[user._id].online ? 'Online' : 'Offline'}</span>
     </div>
      <Segment>
        <Link to={match.url + "settings"}>Settings</Link>
        <Button onClick={logout}>Sign out</Button>
        <Button onClick={openModal}>Delete profile</Button>
        <Button onClick={sendMessage}>Send a message</Button>
      </Segment>
    </div>
    </div>

  )
}

export default PageHeader;
