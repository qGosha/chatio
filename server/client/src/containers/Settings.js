import React, { Component } from "react";
import { Router, Route, Switch } from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';

const Settings = props => {
  const { auth, dashboard, match } = props;
  return (
    <div>Settings: match.params.topicId</div>
  )
}



function mapStateToProps({ auth, dashboard }) {
  return {auth, dashboard};
}


export default connect(mapStateToProps, actions)(Settings);
