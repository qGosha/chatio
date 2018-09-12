import React, { Component } from "react";
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
  renderContent() {
    switch(this.props.auth) {
      case null:
       return 'loading';
      case false:
       return 'logged out';
      default:
       return <div><img src={this.props.auth.photos[0].value} /></div>;
    }
  }
  render() {
    console.log(this.props)
    return(
      <div>
        <h2>
         Application
        </h2>
        {this.renderContent()}
      </div>
    )
  }

};


function mapStateToProps({ auth }) {
  return {auth};
}


export default connect(mapStateToProps)(Header);
