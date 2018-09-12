import React, { Component } from "react";
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

export class Header extends Component {
  renderContent() {
    switch(this.props.auth) {
      case null:
       return;
      case false:
       return 'logged out';
      default:
      return 'im in'
    }
  }
  render() {
    return(
      <div>
      <h2>
      {this.renderContent()}
      </h2>
      </div>
    )
  }

};


function mapStateToProps({ auth }) {
  return { auth }
}


export default connect(mapStateToProps)(Header);
