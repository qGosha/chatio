import React, { Component } from "react";
import { Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute, EnterRoute, ConfirmRoute } from '../helpers/routing';
import Dashboard from './Dashboard';
import Confirmation from './Confirmation';
import NoMatch from '../components/noMatch';
import Login from './Login';
import Signup from './Signup';
import Loadable from 'react-loading-overlay';
import * as actions from '../actions';
import {connect} from 'react-redux';
import history  from '../helpers/history';
import io from 'socket.io-client';


class App extends Component {
 state = {
   response: null
 }
 componentDidMount() {
   this.props.fetchUser();
   const socket = io('http://localhost:5000');
   socket.on('connect', () => {
      console.log("sdpogpdogdsg", socket.id); // true
    });
    socket.on('fromAPI', (message) => {
       console.log(message);
     });
   // socket.on("FromAPI", data => this.setState({ response: data }));
  }
  render () {
    const { auth, isLoading } = this.props;
    if(!auth) return null;
    return(
      <Loadable
        active={isLoading}
        spinner
        style={{position: isLoading ? 'fixed' : 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
        text='Loading...'
        >
        <Router history={history}>
         <Switch>
          <PrivateRoute exact path='/' auth={auth} component={Dashboard}/>
          <PrivateRoute exact path='/dashboard' auth={auth} component={Dashboard}/>
          <EnterRoute exact path='/login' auth={auth} component={Login}/>
          <Route exact path='/signup' auth={auth} component={Signup}/>
          <ConfirmRoute exact path='/confirmation' auth={auth} component={Confirmation}/>
          <Route component={NoMatch} />
         </Switch>
        </Router>
      </Loadable>
    )
  }

};


const mapStateToProps = (state) => ({
  auth: state.auth,
  isLoading: state.isLoading
});

export default connect(mapStateToProps, actions)(App);
