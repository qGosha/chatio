import React, { Component, Fragment } from "react";
import {connect} from 'react-redux';
import * as actions from '../actions';

class WelcomePage extends Component {
  render () {
    return (
      <div>Welcome to Messenger. Choose a person you want to talk to</div>
    )
  }
}


export default connect(null, actions)(WelcomePage);
