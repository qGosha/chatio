import { withRouter } from 'react-router-dom';
import * as actions from '../actions';
import React from "react";
import {connect} from 'react-redux';

const AuthButton = withRouter(
  ({ history, logoutUser }) =>
        <button
          onClick={() => {
            logoutUser();
            history.push("/login");
          }}
        >
          Sign out
        </button>
);

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(AuthButton));
