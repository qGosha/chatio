import React from "react";
import {Image, Icon} from "semantic-ui-react";


const styles = {
  container: {
    width: "100%",
    gridArea: "avatar"
  },
  chatImg: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  icon: {
    alignSelf: "center",
    color: "green"
  },
  img: {
    width: "100px",
    height: "100px"
  },
  singleAvatar: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  }
};

const AvatarBlock = ({iHaveDialogWith, randomUsers, auth, activeDialogWith, standartImage}) => {
  const user = auth.user;
  let peer;
  if (iHaveDialogWith) {
   peer = iHaveDialogWith[activeDialogWith] || randomUsers.find( user => user._id === activeDialogWith);
  }
  const online = activeDialogWith ? peer.online : user.online;
  const alone = (
    <div style={styles.singleAvatar}>
      <h2>{`Hello ${user.name}`}</h2>
      <Image
        style={styles.img}
        alt="profile photo"
        src={user.photos.length ? user.photos[0] : standartImage}
        size="tiny"
        bordered
      />
      <span style={{fontWeight: "bold"}}>
        My status:{" "}
        <span style={{color: online ? "green" : "red"}}>
          {online ? "Online" : "Offline"}
        </span>
      </span>
    </div>
  );
  const chatWith = activeDialogWith && (
    <div style={styles.chatImg}>
      <div
        style={{
          width: "2em",
          height: "2em",
          backgroundImage: `url(${
            user.photos.length ? user.photos[0] : standartImage
          })`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: "cover"
        }}
      />
      <Icon name="angle double right" style={styles.icon} />
      <div
      style={{
        width: "2em",
        height: "2em",
        backgroundImage: `url(${
           peer && peer.photos.length ? peer.photos[0] : standartImage
        })`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: "cover"
      }}
      />
    </div>
  );
  return (
    <div style={styles.container}>{activeDialogWith ? chatWith : alone}</div>
  );
};

export default AvatarBlock;
