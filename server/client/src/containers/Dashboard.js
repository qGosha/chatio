import React, { Component, Fragment } from "react";
import {connect} from 'react-redux';
import * as actions from '../actions';
import ModalWindow from '../components/modal';
import io from 'socket.io-client';
import SidePanel from '../components/SidePanel';
import Uploader from '../components/uploadButton';
import WelcomePage from '../components/WelcomePage';
import PageHeader from '../components/Header';
import ChatSection from '../components/ChatSection';
import Footer from '../components/Footer';


const standartImage = 'https://react.semantic-ui.com/images/wireframe/square-image.png';


const styles = {
  grid: {
    display: 'grid',
    gridTemplateAreas:
    `'menu header header header header '
    'menu main main main main '
    'menu footer footer footer footer '`,
    gridTemplateColumns: '1fr 4fr 4fr 4fr',
    gridGap: '10px',
    width:'100vw',
    height: '100vh',
  },

 sendButton: {
   display: 'flex',
   flexDirection: 'row'
 },

}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      socket: null,
      messageText: '',
      pictures: [],
      uploaderVisible: false,
      imagesWereUploaded: false
    };
    this.uploadNewTrigger = false;
    this.uploadTriggerCount = 0;
    this.handleRef = element => {
      this.dialog = element;
    };
  }

  logout = () => {
    this.state.socket.disconnect();
    this.props.logoutUser();
  }

  handleDialogScroll = async (e) => {
    const { haveAllMessagesBeenFetched } = this.props.dashboard;
    if (this.uploadNewTrigger || haveAllMessagesBeenFetched) return;
    const target = e.target;
    const height = ((target.scrollHeight - target.scrollTop) / target.scrollHeight) * 100;
    if (height > 50) {
      this.uploadNewTrigger = true;
      const { activeDialogWith } = this.props.dashboard;
      const skip = this.uploadTriggerCount + 20;
      this.uploadTriggerCount = skip;
      console.log('alaaaarm');
      await this.props.uploadMessagesOnScroll(activeDialogWith, skip);
      this.uploadNewTrigger = false;
    }
  }

   handleOpenDialog = async (id) => {
     if (id === activeDialogWith) return;
    const { allUsers, activeDialogWith} = this.props.dashboard;
    this.uploadTriggerCount = 0;
    this.uploadNewTrigger = false;
    await this.props.openDialog(id);
    if (this.dialog) {
      this.dialog.scrollTop = this.dialog.scrollHeight;
    }
  }

  onDrop = (pictures) => {
      this.setState({ pictures });
    }

 sendImages = () => {
   const { pictures } = this.state;
   const { activeDialogWith } = this.props.dashboard;

   if (!pictures.length || !activeDialogWith) return;
   let formData = new FormData()
   pictures.forEach((file, i) => {
      formData.append(i, file)
    })
    formData.append('activeDialogWith', activeDialogWith);
    this.props.sendImages(formData);
    this.setState({imagesWereUploaded: true, pictures: []})
 }
  sendMessage = () => {
    const { messageText } = this.state;
    const { activeDialogWith } = this.props.dashboard;
    if (!messageText || !activeDialogWith) return;
    const newMessage = {
      message: {
        text: messageText
      },
      recipient: activeDialogWith,
    }
    this.state.socket.emit('outboundMessage', newMessage);
    this.setState({messageText: ''})
  }

  componentDidMount() {
  const socket = io('http://localhost:5000');

  this.setState({socket});
      socket.on('userChangedStatus', (message) => {
         this.props.userChangedStatus(message);
       });
      socket.on('imageHasBeenUploaded', message => {
       const dialog = this.dialog;
       let scroll;
        if (dialog) {
          if (dialog.scrollTop + dialog.clientHeight === dialog.scrollHeight) {
            scroll = true;
          }
        this.props.addImageUrl(message);
        if(scroll) {
          dialog.scrollTop = dialog.scrollHeight;
         }
        }
     });
      socket.on('inboundMessage', (message) => {
       const dialog = this.dialog;
       let scroll;
        if (dialog) {
          if (dialog.scrollTop + dialog.clientHeight === dialog.scrollHeight) {
            scroll = true;
          }
        this.props.addMessage(message);
        this.uploadTriggerCount++;
        if(scroll) {
          dialog.scrollTop = dialog.scrollHeight;
         }
        }
      });
      socket.on('disconnect', (e) => console.log('disconnected', e));
   this.props.getPeers();
  }

  render() {
  const { auth, deleteUser, logoutUser, dashboard, openDialog } = this.props;
  const { currentMessages, activeDialogWith, iHaveDialogWith, allUsers } = dashboard;
  const { pictures, imagesWereUploaded, uploaderVisible, messageText } = this.state;
  const user = auth.user;
  const welcomeSection = <WelcomePage allUsers={allUsers} auth={auth} openDialog={this.handleOpenDialog}/>;
  const chattingSection = (
    <Fragment>
      <ChatSection
       dashboard={dashboard}
       auth={auth}
       handleDialogScroll={this.handleDialogScroll}
       handleRef={this.handleRef}
       closeDialog={this.props.closeDialog}
       markMsgRead={this.props.markMsgRead}
       />
      <Footer
        onSubmit={(e) => { e.preventDefault(); this.sendMessage(); }}
        messageText={messageText}
        onChange={(e) => this.setState({messageText: e.target.value})}
        handleSendClick={this.sendMessage}
        handleImageSendClick={() => this.setState({ uploaderVisible: true, imagesWereUploaded: false })}
        />
    </Fragment>
  )
    return(
      <div style={styles.grid}>
        <ModalWindow
         open={this.state.modalOpen}
         onClose={() => this.setState({ modalOpen: false})}
         headertext={'Delete Your Account'}
         contenttext={'Are you sure you want to delete your account?'}
         onNegative={() => this.setState({ modalOpen: false})}
         onPositive={() => deleteUser()}
         />
          <SidePanel dashboard={dashboard} openDialog={(id) => this.handleOpenDialog(id)}/>
          <PageHeader
           auth={auth}
           allUsers={allUsers}
           logout={this.logout}
           sendMessage={this.sendMessage}
           openModal={() => this.setState({ modalOpen: true })}
           standartImage={standartImage}
           />
           { activeDialogWith ? chattingSection : welcomeSection }

           { imagesWereUploaded ? null : <Uploader
            onClose={() => this.setState({ uploaderVisible: false})}
            onDrop={this.onDrop}
            visible={uploaderVisible}
            onUpload={this.sendImages}
              /> }
      </div>
    )
  }

};

function mapStateToProps({ auth, dashboard }) {
  return {auth, dashboard};
}


export default connect(mapStateToProps, actions)(Dashboard);
