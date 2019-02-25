import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {reduxForm, Field} from "redux-form";
import {InputComponent} from "../helpers/common";
import {Form, Grid, Header, Message, Segment, Icon} from "semantic-ui-react";
import * as actions from "../actions";
import {validate} from "../helpers/validation";
import SocialButtons from "../components/socialButtons";

const Login = ({
  error,
  handleSubmit,
  submitting,
  localLoginUser,
  showLoadingScreen
}) => {
  return (
    <Grid
      textAlign="center"
      verticalAlign="middle"
      container
      stackable
      divided
      columns={2}
      relaxed
      style={{paddingTop: "3rem"}}
    >
      <Grid.Row>
        <Grid.Column>
          <Header as="h2" color="teal" textAlign="center">
            Log-in to your account
          </Header>
          <Form
            size="large"
            onSubmit={handleSubmit(localLoginUser)}
            error={!!error}
          >
            <Segment stacked>
              <Field
                name="email"
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                component={InputComponent}
              />
              <Field
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                component={InputComponent}
              />
              <Form.Button
                color="blue"
                fluid
                size="large"
                loading={submitting}
                disabled={submitting}
              >
                Login
              </Form.Button>
            </Segment>

            {error && (
              <Message negative style={{textAlign: "left"}}>
                <Icon name="times circle" color="red" />
                <span>{error.message}</span>
              </Message>
            )}
          </Form>
          <Message>
            New to us? <Link to="/signup">Sign Up</Link>
          </Message>
        </Grid.Column>
        <Grid.Column>
          <SocialButtons showLoadingScreen={showLoadingScreen} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

const ConnectedLogin = connect(null, actions)(Login);

export default reduxForm({
  form: "loginForm",
  validate
})(ConnectedLogin);
