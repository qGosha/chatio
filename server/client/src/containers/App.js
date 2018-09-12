import React, { Component } from "react";
import { BrowserRouter, Route } from 'react-router-dom';
import { Header } from '../components/header.js'
import * as actions from '../actions';
import {connect} from 'react-redux';
class App extends Component {
  componentDidMount() {
   this.props.fetchUser();
  }
  render () {
    return(
      <div>
        <BrowserRouter>
         <div>
          <Route exact path='/' component={Header}/>
         </div>
        </BrowserRouter>
      </div>
    )
  }

};

export default connect(null, actions)(App);
