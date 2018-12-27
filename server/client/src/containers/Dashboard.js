import React, { Component, Fragment } from "react";
import {connect} from 'react-redux';
import * as actions from '../actions';
import { Segment, Button, Form, Grid, Header, Message, Icon, Input, Image, Ref } from 'semantic-ui-react';
import ModalWindow from '../components/modal';
import io from 'socket.io-client';
import SidePanel from '../components/SidePanel';
import Messages from '../components/Messages'

const standartImage = 'https://react.semantic-ui.com/images/wireframe/square-image.png';


const styles = {
  grid: {
    display: 'grid',
    gridTemplateAreas:
    `'menu header header header header header'
    'menu main main main main main'
    'menu footer footer footer footer footer'`,
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
   overflowY: 'scroll'
 },
 sendButton: {
   display: 'flex',
   flexDirection: 'row'
 }
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false, socket: null, messageText: '', };
    this.uploadNewTrigger = false;
    this.uploadTriggerCount = 0;
    this.sendMessage = this.sendMessage.bind(this);
    this.logout = this.logout.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleDialogScroll = this.handleDialogScroll.bind(this);
    this.handleRef = element => {
      this.dialog = element;
    };
  }

  logout() {
    this.state.socket.disconnect();
    this.props.logoutUser();
  }

  async handleDialogScroll(e) {
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

  async handleOpenDialog(id) {
    this.uploadTriggerCount = 0;
    this.uploadNewTrigger = false;
    await this.props.openDialog(id);
    if (this.dialog) {
      this.dialog.scrollTop = this.dialog.scrollHeight;
    }
  }

  sendMessage() {
    const { activeDialogWith } = this.props.dashboard;
    const { user } = this.props.auth;
    const newMessage = {
      message: {
        text: this.state.messageText
      },
      recipient: activeDialogWith,

    }
    this.state.socket.emit('outboundMessage', newMessage);

  }
  componentDidMount() {
  const socket = io('http://localhost:5000');

  this.setState({socket});
    socket.on('connect', () => {
       console.log("sdpogpdogdsg", socket.id); // true
       socket.on('fromAPI', (message) => {
          console.log(message);
        });
      socket.on('userChangedStatus', (message) => {
         this.props.userChangedStatus(message);
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
      socket.on('disconnect', (e) => console.log('disconnected', e))
     });
   this.props.getPeers();

    // socket.on("FromAPI", data => this.setState({ response: data }));
  }
  render() {
  const { auth, deleteUser, logoutUser, dashboard, openDialog } = this.props;
  const { currentMessages } = dashboard;
  const user = auth.user;
    return(
      <div style={styles.grid}>
       <div style={{gridArea: 'menu'}}>
        <SidePanel friendOptions={dashboard.allUsers} openDialog={(id) => this.handleOpenDialog(id)}/>
       </div>
       <div style={{gridArea: 'header'}}>
        <div style={styles.header}>
         <div>
          <h2>
           {`Hello ${user.name}`}
          </h2>
          <Image alt='profile photo' src={user.photos.length ? user.photos[0].value : standartImage} size='tiny' bordered />
         </div>
          <Segment>
            <Button onClick={this.logout}>Sign out</Button>
            <Button onClick={() => this.setState({ modalOpen: true })}>Delete profile</Button>
            <Button onClick={this.sendMessage}>Send a message</Button>
          </Segment>
        </div>
        </div>
        <div style={{gridArea: 'main'}}  >
         <Ref innerRef={this.handleRef}>
          <Segment style={styles.dialog} onScroll={this.handleDialogScroll}>
            <Messages messages={currentMessages} dashboard={dashboard} auth={auth}/>
          </Segment>
          </Ref>
          <ModalWindow
           open={this.state.modalOpen}
           onClose={() => this.setState({ modalOpen: false})}
           headertext={'Delete Your Account'}
           contenttext={'Are you sure you want to delete your account?'}
           onNegative={() => this.setState({ modalOpen: false})}
           onPositive={() => deleteUser()}
           />
         </div>
         <div style={{gridArea: 'footer'}}>
           <Input value={this.state.messageText} fluid placeholder='Send...' onChange={(e) => this.setState({messageText: e.target.value})}/>
           <Button onClick={this.sendMessage}>Send</Button>
         </div>
      </div>
    )
  }

};

function mapStateToProps({ auth, dashboard }) {
  return {auth, dashboard};
}


export default connect(mapStateToProps, actions)(Dashboard);
