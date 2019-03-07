import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {reduxForm, Field, SubmissionError} from "redux-form";
import {InputComponent} from "../helpers/common";
import {Form, Grid, Header, Message, Segment, Icon} from "semantic-ui-react";
import * as actions from "../actions";
import {validate} from "../helpers/validation";
import axios from "axios";

const styles = {
  label: {
    fontWeight: 'bold',
    display: 'block',
    textAlign: 'left',
    marginBottom: '5px'
  },

}

const PasswordRecovery = ({
  error,
  handleSubmit,
  submitting,
  clearFields,
  form,
  match
}) => {
  const sendPasswords = async value => {
    const { params } = match;
    try {
      const res = await axios.post('/api/reset_password', params.token);
      const {data} = res;
      if (data.success) {
        // clearFields(form, false, 'email'); left here
      } else throw Error(data.message);
    } catch (err) {
      throw new SubmissionError({_error: err});
    }
  }
  return (
    <Grid
      textAlign="center"
      verticalAlign="middle"
      container
      stackable
      divided
      relaxed
    >
      <Grid.Row style={{maxWidth: '500px'}}>
        <Grid.Column>
          <Header as="h2" color="teal" textAlign="center" style={{marginTop: '2rem'}}>
            Reset your password
          </Header>
          <Form
            size="large"
            onSubmit={handleSubmit(sendPasswords)}
            error={!!error}
          >
            <Segment stacked style={{fontSize: '16px'}}>
            <span style={styles.label}>Password</span>
            <Field
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              component={InputComponent}
            />
            <span style={styles.label}>Repeat your password</span>
            <Field
              fluid
              name="repPassword"
              icon="lock"
              iconPosition="left"
              placeholder="Repeat your password"
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
                Reset
              </Form.Button>
            </Segment>
            {submitSucceeded && (
              <Message positive style={{textAlign: "left"}}>
                <Icon name="check circle" color="green" />
                <span>Success! A password reset email has been sent to your email</span>
              </Message>
            )}
            {error && (
              <Message negative style={{textAlign: "left"}}>
                <Icon name="times circle" color="red" />
                <span>{error.message}</span>
              </Message>
            )}
          </Form>
          <Message>
            Know your password? <Link to="/login">Sign in</Link>
          </Message>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

const ConnectedPasswordRecovery = connect(null, actions)(PasswordRecovery);

export default reduxForm({
  form: "resetPassword",
  validate
})(ConnectedPasswordRecovery);
