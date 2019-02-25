import React, {Fragment} from "react";
import {Button, Icon} from "semantic-ui-react";

const SocialButtons = ({showLoadingScreen}) => {
  const loginWith = path => {
    showLoadingScreen();
    window.location = path;
    return;
  };
  return (
    <Fragment>
      <Button
        icon
        onClick={() => loginWith("/auth/google")}
        color="google plus"
        fluid
        size="large"
      >
        <Icon style={{float: "left"}} name="google plus square" size="large" />
        Sign in with Google
      </Button>
      <Button
        icon
        style={{marginTop: "10px"}}
        onClick={() => loginWith("/auth/facebook")}
        color="facebook"
        fluid
        size="large"
      >
        <Icon style={{float: "left"}} name="facebook" size="large" />
        Sign in with Facebook
      </Button>
    </Fragment>
  );
};

export default SocialButtons;
