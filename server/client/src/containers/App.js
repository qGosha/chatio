import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route,  Redirect, withRouter } from 'react-router-dom';
import { PrivateRoute } from '../helpers/routing';
import Header from '../components/header.js'
import Login from './Login'
import * as actions from '../actions';
import {connect} from 'react-redux';
class App extends Component {
  componentDidMount() {
   this.props.fetchUser();
  }
  render () {
    return(
      <Fragment>
        <Router>
         <div>
          <PrivateRoute exact path='/' component={Header}/>
          <Route exact path='/login' component={Login}/>
         </div>
        </Router>
      </Fragment>
    )
  }

};


function mapStateToProps({ auth }) {
  return {auth};
}

export default connect(mapStateToProps, actions)(App);
