import React, { Component, Fragment } from "react";
import {connect} from 'react-redux';
import * as actions from '../actions';
import { Segment, Button } from 'semantic-ui-react';
import ModalWindow from '../components/modal';
import io from 'socket.io-client';
import { Dropdown } from 'semantic-ui-react'



class Dashboard extends Component {
  state = { modalOpen: false, socket: null };
  sendMessage = this.sendMessage.bind(this);
  logout = this.logout.bind(this);
  logout() {
    this.state.socket.disconnect();
    this.props.logoutUser();
  }
  sendMessage() {
    const newMessage = {
      message: {
        text: 'SuperText'
      },
      users: [ {user: '5beba4b1f0ca3614a491f1f4'} ],

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
     });
   this.props.getPeers();
    // socket.on("FromAPI", data => this.setState({ response: data }));
  }
  render() {
  const { auth, deleteUser, logoutUser } = this.props;
  const user = auth.user;
    return(
      <Fragment>
        <h2>
         {`Hello ${user.name}`}
        </h2>
        <Segment>
          <Button onClick={this.logout}>Sign out</Button>
          <Button onClick={() => this.setState({ modalOpen: true })}>Delete profile</Button>
          <Button onClick={this.sendMessage}>Send a message</Button>
        </Segment>
        <Segment>
        </Segment>
        <Segment>
          <img alt='profile photo' src={user.photos.length && user.photos[0].value} />
        </Segment>
        <ModalWindow
         open={this.state.modalOpen}
         onClose={() => this.setState({ modalOpen: false})}
         headertext={'Delete Your Account'}
         contenttext={'Are you sure you want to delete your account?'}
         onNegative={() => this.setState({ modalOpen: false})}
         onPositive={() => deleteUser()}
         />
      </Fragment>
    )
  }

};


function mapStateToProps({ auth }) {
  return {auth};
}


export default connect(mapStateToProps, actions)(Dashboard);
