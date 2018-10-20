import React, { Component } from "react";
import {connect} from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import * as actions from '../actions';
import AuthButton from '../helpers/authButton';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';


class Dashboard extends Component {

  // async componentDidMount() {
  //  setTimeout(this.onLongLoading.bind(this), 800);
  //  await Promise.resolve(this.props.fetchUser());
  //  this.props.hideLoadingScreen()
  // }

  // onLongLoading() {
  //   if (!this.props.auth) {
  //     this.props.showLoadingScreen();
  //   }
  // }
  render() {
  const { auth, loading } = this.props;
  const user = auth.user;
    return(
      <Dimmer.Dimmable as={Segment} dimmed={loading}>
          <Dimmer active={loading} inverted>
            <Loader>Loading</Loader>
          </Dimmer>
        <h2>
         {`Hello ${user.name}`}
        </h2>
        <div>
        <AuthButton/>
        </div>
        <div><img src={user.photos.length && user.photos[0].value} /></div>
        </Dimmer.Dimmable>
    )
  }

};


function mapStateToProps({ auth, loading }) {
  return {auth, loading};
}


export default connect(mapStateToProps, actions)(Dashboard);
