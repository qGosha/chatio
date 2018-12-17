import React, { Component, Fragment } from "react";
import {connect} from 'react-redux';
import * as actions from '../actions';
import { Segment, Button, Form, Grid, Header, Message, Icon, Input, Image } from 'semantic-ui-react';
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
 }
}

class Dashboard extends Component {
  state = { modalOpen: false, socket: null };
  sendMessage = this.sendMessage.bind(this);
  logout = this.logout.bind(this);

  logout() {
    this.state.socket.disconnect();
    this.props.logoutUser();
  }

  sendMessage() {
    const { activeDialogWith } = this.props.dashboard;
    const newMessage = {
      message: {
        text: 'SuperText'
      },
      recipient: activeDialogWith,

    }
    this.state.socket.emit('createMessage', newMessage);
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
        <SidePanel friendOptions={dashboard.allUsers} openDialog={openDialog}/>
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
        <div style={{gridArea: 'main'}}>
          <Segment style={styles.dialog}>
           <Messages messages={currentMessages} friendOptions={dashboard.allUsers} />
          </Segment>
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
           <Input fluid action='Send' placeholder='Send...' />
         </div>
      </div>
    )
  }

};
// const friendOptions = dashboard.allUsers && dashboard.allUsers.map( user => ({
//     text: user.name,
//     value: user.name,
// }) )
// <Segment>
//   <Dropdown placeholder='Select Friend' fluid selection options={friendOptions} />
// </Segment>
function mapStateToProps({ auth, dashboard }) {
  return {auth, dashboard};
}


export default connect(mapStateToProps, actions)(Dashboard);
