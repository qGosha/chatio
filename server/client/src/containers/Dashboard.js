import React, { Component, Fragment } from "react";
import {connect} from 'react-redux';
import * as actions from '../actions';
import { Segment, Button, Form, Grid, Header, Message, Icon, Input, Image, Ref, Label } from 'semantic-ui-react';
import ModalWindow from '../components/modal';
import io from 'socket.io-client';
import SidePanel from '../components/SidePanel';
import Messages from '../components/Messages';
import Uploader from '../components/uploadButton';
import WelcomePage from '../components/WelcomePage';

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
  header: {
   display: 'flex',
   justifyContent: 'space-between'
 },
 dialog: {
   height: '300px',
   overflowY: 'scroll',
   padding: '10px'
 },
 sendButton: {
   display: 'flex',
   flexDirection: 'row'
 },
 footer: {
   gridArea: 'footer',
   display: 'grid',
   gridTemplateColumns: '5fr 1fr 1fr',
   gridTemplateRows: '0.4fr'
 }
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
    if (height > 70) {
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
    const { allUsers } = this.props.dashboard;
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
    socket.on('connect', () => {
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
     });
   this.props.getPeers();
  }

  render() {
  const { auth, deleteUser, logoutUser, dashboard, openDialog } = this.props;
  const { currentMessages, activeDialogWith, iHaveDialogWith, allUsers } = dashboard;
  const { pictures, imagesWereUploaded, uploaderVisible, messageText } = this.state;
  const user = auth.user;
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
         <div style={{gridArea: 'menu'}}>
          <SidePanel friendOptions={iHaveDialogWith} allUsers={allUsers} openDialog={(id) => this.handleOpenDialog(id)}/>
         </div>
         <div style={{gridArea: 'header'}}>
          <div style={styles.header}>
           <div>
            <h2>
             {`Hello ${user.name}`}
            </h2>
            <Image alt='profile photo' src={user.photos.length ? user.photos[0].value : standartImage} size='tiny' bordered />
            <span>My status: {allUsers && allUsers[auth.user._id].online ? 'Online' : 'Offline'}</span>
           </div>
            <Segment>
              <Button onClick={this.logout}>Sign out</Button>
              <Button onClick={() => this.setState({ modalOpen: true })}>Delete profile</Button>
              <Button onClick={this.sendMessage}>Send a message</Button>
            </Segment>
          </div>
          </div>
          <div style={{gridArea: 'main'}}>
           { activeDialogWith ? <Ref innerRef={this.handleRef}>
            <Segment style={styles.dialog} onScroll={this.handleDialogScroll}>
              <Messages messages={currentMessages} dashboard={dashboard} auth={auth}/>
            </Segment>
            </Ref> : <WelcomePage />}


           </div>
            <form style={styles.footer} onSubmit={(e) => {
              e.preventDefault();
              this.sendMessage();
            }}>
             <Input value={messageText} fluid placeholder='Send...' onChange={(e) => this.setState({messageText: e.target.value})}/>

             <Button onClick={this.sendMessage}>Send</Button>
             <Button icon='attach' onClick={() => this.setState({ uploaderVisible: true, imagesWereUploaded: false })} />
           </form>
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
