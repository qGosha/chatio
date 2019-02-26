import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import * as actions from "../actions";
import io from "socket.io-client";
import SidePanel from "../components/SidePanel";
import Uploader from "../components/uploadButton";
import WelcomePage from "../components/WelcomePage";
import PageHeader from "../components/Header";
import ChatSection from "../components/ChatSection";
import Footer from "../components/Footer";
import Settings from "./Settings";
import AvatarBlock from "../components/AvatarBlock";
import {Route, Switch} from "react-router-dom";
import Media from 'react-media';

const sound = require("../sounds/msg.mp3");
const standartImage = require("../img/square-image.png");

const styles = {
  grid: {
    display: "grid",
    gridTemplateAreas:
    `'header header header header'
     'menu avatar avatar avatar'
     'menu main main main'
     'menu footer footer footer'`,
    gridTemplateColumns: "1fr 4fr 4fr 4fr",
    gridTemplateRows: '1fr 3fr 4fr 4fr',
    gridGap: "10px",
    height: "100vh",
    overflowY: 'hidden'
  },
  header: {
    gridArea: 'header'
  },
  sendButton: {
    display: "flex",
    flexDirection: "row"
  },
 dynamicImageStyle: {
    minHeight: '200px',
    maxWidth: '300px',
    maxHeight: '300px',
  },
  chatWindow: {
    height: '350px'
  },
  headerButtonJustify: {
    justifyContent: 'flex-end'
  }
};

const mobileGrid = {
    grid: {
        display: "grid",
        gridTemplateAreas:
        `'header header header'
         'avatar avatar avatar'
         'main main main'
         'footer footer footer'`,
        gridTemplateColumns: "4fr 4fr 4fr",
        gridTemplateRows: '0fr 0fr 0fr 4fr',
        gridGap: "10px",
        height: "100vh"
      },
    header: {
      gridArea: 'header / header / header'
    },
    dynamicImageStyle: {
       minHeight: '150px',
       maxWidth: '300px',
       maxHeight: '300px',
     },
     chatWindow: {
       height: '450px'
     },
     headerButtonJustify: {
       justifyContent: 'center'
     }
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageText: "",
      pictures: [],
      uploaderVisible: false,
      imagesWereUploaded: false,
      isTabActive: true
    };
    this.uploadNewTrigger = false;
    this.uploadTriggerCount = 0;
    this.handleRef = element => {
      this.dialog = element;
    };
    this.eventName = null;
    this.eventKey = null;
    this.newMsgTabNotification = null;
    this.normalTitle;
    this.audio = new Audio(sound);
  }

  logout = () => {
    this.props.dashboard.socket.disconnect();
    this.props.logoutUser();
  };

  handleDialogScroll = async e => {
    const {haveAllMessagesBeenFetched} = this.props.dashboard;
    if (this.uploadNewTrigger || haveAllMessagesBeenFetched) return;
    const target = e.target;
    const height =
      (target.scrollHeight - target.scrollTop) / target.scrollHeight * 100;
    if (height > 50) {
      this.uploadNewTrigger = true;
      const {activeDialogWith} = this.props.dashboard;
      const skip = this.uploadTriggerCount + 20;
      this.uploadTriggerCount = skip;
      console.log("alaaaarm");
      await this.props.uploadMessagesOnScroll(activeDialogWith, skip);
      this.uploadNewTrigger = false;
    }
  };

  handleOpenDialog = async id => {
    this.uploadTriggerCount = 0;
    this.uploadNewTrigger = false;
    await this.props.openDialog(id);
    if (this.dialog) {
      this.dialog.scrollTop = this.dialog.scrollHeight;
    }
  };

  onDrop = pictures => {
    this.setState({pictures});
  };

  sendImages = () => {
    const {pictures} = this.state;
    const {sendImages, createNewConversation, dashboard} = this.props;
    const {activeDialogWith, iHaveDialogWith} = dashboard;

    if (!pictures.length || !activeDialogWith) return;
    let formData = new FormData();
    pictures.forEach((file, i) => {
      formData.append(i, file);
    });
    formData.append("activeDialogWith", activeDialogWith);
    sendImages(formData);
    if (!iHaveDialogWith.includes(activeDialogWith)) {
      createNewConversation(activeDialogWith);
    }
    this.setState({imagesWereUploaded: true, pictures: []});
  };
  sendMessage = () => {
    const {messageText} = this.state;
    const {createNewConversation, dashboard} = this.props;
    const {activeDialogWith, iHaveDialogWith} = dashboard;
    const { socket } = dashboard;
    if (!messageText || !activeDialogWith) return;
    const newMessage = {
      message: {
        text: messageText
      },
      recipient: activeDialogWith
    };
    socket.emit("outboundMessage", newMessage);
    if (!iHaveDialogWith.includes(activeDialogWith)) {
      createNewConversation(activeDialogWith);
    }
    this.setState({messageText: ""});
  };

  handleTabVisibility = e => {
    const isTabActive = !e.target[this.eventKey];
    if (isTabActive) {
      clearInterval(this.newMsgTabNotification);
      document.title = this.normalTitle;
    }
    this.setState({isTabActive});
  };

  newMsgNewTitle = () => {
    if (document.title === this.normalTitle) {
      document.title = "You have new message(s)!";
    } else {
      document.title = this.normalTitle;
    }
  };

  componentDidMount() {
    this.audio.load();
    this.normalTitle = document.title;
    const socket = io("https://im-messenger.herokuapp.com");
    this.props.setSocket(socket);
    const keys = {
      hidden: "visibilitychange",
      webkitHidden: "webkitvisibilitychange",
      mozHidden: "mozvisibilitychange",
      msHidden: "msvisibilitychange"
    };

    for (let stateKey in keys) {
      if (stateKey in document) {
        this.eventKey = stateKey;
        this.eventName = keys[stateKey];
        break;
      }
    }

    document.addEventListener(this.eventName, this.handleTabVisibility);

    socket.on("userChangedStatus", message => {
      this.props.userChangedStatus(message);
    });
    socket.on("imageHasBeenUploaded", async message => {
      const dialog = this.dialog;
      let scroll;
      if (dialog) {
        if (dialog.scrollTop + dialog.clientHeight === dialog.scrollHeight) {
          scroll = true;
        }
        let img = new Image();
        img.onload = () => {
          this.props.addImageUrl(message);
          if (scroll) {
            dialog.scrollTop = dialog.scrollHeight;
          }
        }
        img.src = message.message.text;
      }
    });
    socket.on("inboundMessage", async message => {
      const {
        dashboard,
        auth,
        newMessageForAnotherDialog,
        messageFromUnknown,
      } = this.props;
      const {activeDialogWith, iHaveDialogWith} = dashboard;
      const { user } = auth;
      if ((message.sender !== auth.user._id) && !user.mute) {
        try {
          await this.audio.play();
        } catch (e) {
          throw new Error(e);
        }
      }
      if (!this.state.isTabActive && message.sender !== auth.user._id) {
        this.newMsgTabNotification = setInterval(this.newMsgNewTitle, 500);
      }
      if (
        message.recipient !== activeDialogWith &&
        message.sender !== activeDialogWith
      ) {
        const id = iHaveDialogWith.find(msg => msg === message.sender);
        if (!id) {
          messageFromUnknown(message.sender);
          return;
        }
        newMessageForAnotherDialog(id);
        return;
      }
      const dialog = this.dialog;
      let scroll;
      if (dialog) {
        if (dialog.scrollTop + dialog.clientHeight === dialog.scrollHeight) {
          scroll = true;
        }
        await this.props.addMessage(message);

        this.uploadTriggerCount++;
        if (scroll) {
          dialog.scrollTop = dialog.scrollHeight;
        }
      }
    });
    socket.on("msgHasBeenReadByPeer", async ids => {
      const {dashboard, msgReadByPeer} = this.props;
      const {currentMessages} = dashboard;
      const updatedMsg = currentMessages.map(msg => {
        if (ids.includes(msg._id)) msg.read = true;
        return msg;
      });
      msgReadByPeer(updatedMsg);
    });
    socket.on("disconnect", e => console.log("disconnected", e));
    this.props.getPeers();
  }

  componentWillUnmount() {
    document.removeEventListener(this.eventName, this.handleTabVisibility);
    clearInterval(this.newMsgTabNotification);
    this.props.dashboard.socket.disconnect();
  }

  render() {
    const {
      auth,
      dashboard,
      removeNotifications,
      closeDialog,
      markMsgRead,
      match,
      location,
    } = this.props;
    const {activeDialogWith, allUsers} = dashboard;
    const {imagesWereUploaded, uploaderVisible, messageText} = this.state;
    const welcomeSection = () => (
      <Fragment>
        <AvatarBlock
          auth={auth}
          allUsers={allUsers}
          activeDialogWith={activeDialogWith}
        />
        <WelcomePage
          allUsers={allUsers}
          auth={auth}
          openDialog={this.handleOpenDialog}
          standartImage={standartImage}
        />
      </Fragment>
    );

    const chattingSection = style => (
      <Fragment>
        <AvatarBlock
          auth={auth}
          allUsers={allUsers}
          activeDialogWith={activeDialogWith}
          standartImage={standartImage}
        />
        <ChatSection
          dashboard={dashboard}
          auth={auth}
          handleDialogScroll={this.handleDialogScroll}
          handleRef={this.handleRef}
          closeDialog={closeDialog}
          markMsgRead={markMsgRead}
          removeNotifications={removeNotifications}
          standartImage={standartImage}
          topStyle={style}
        />
        <Footer
          onSubmit={e => {
            e.preventDefault();
            this.sendMessage();
          }}
          messageText={messageText}
          onChange={e => this.setState({messageText: e.target.value})}
          handleSendClick={this.sendMessage}
          handleImageSendClick={() =>
            this.setState({uploaderVisible: true, imagesWereUploaded: false})
          }
        />
      </Fragment>
    );
    const content = style => (
      <div style={style.grid}>
        <SidePanel
          dashboard={dashboard}
          openDialog={id => this.handleOpenDialog(id)}
          standartImage={standartImage}
        />
        <PageHeader
          auth={auth}
          logout={this.logout}
          location={location}
          closeDialog={closeDialog}
          topStyle={style}
        />

        <Switch>
          <Route exact path={`${match.url}`} render={ activeDialogWith ? () => chattingSection(style) : welcomeSection } />
    
        </Switch>

        {imagesWereUploaded ? null : (
          <Uploader
            onClose={() => this.setState({uploaderVisible: false})}
            onDrop={this.onDrop}
            visible={uploaderVisible}
            onUpload={this.sendImages}
          />
        )}
      </div>
    )

    return (
      <Media query="(max-width: 599px)">
          {matches =>
            matches ? content(mobileGrid) : content(styles)
          }
        </Media>
    );
  }
}

function mapStateToProps({auth, dashboard}) {
  return {auth, dashboard};
}

export default connect(mapStateToProps, actions)(Dashboard);
