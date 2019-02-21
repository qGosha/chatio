import React, {Component} from "react";
import {connect} from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import * as actions from "../actions";
import {Button, Grid, Form, Message, Icon} from "semantic-ui-react";
import axios from "axios";
import {reduxForm, Field, SubmissionError} from "redux-form";
import {validate} from "../helpers/validation";
import {normalizeNumber} from "../helpers/normalizing";
import {InputComponent} from "../helpers/common";
import ChangeEmailForm from "../components/ChangeEmailForm";
import PageHeader from "../components/Header";

class Confirmation extends Component {
  state = {
    showResendSuccess: false,
    resendCounts: 0,
    showRecaptcha: false,
    isChangeEmailFormVisible: false,
    showChangeEmailSuccess: false
  };

  logout = () => {
    const {socket} = this.props.dashboard;
    if (socket) {
      socket.disconnect();
    }
    this.props.logoutUser();
  };

  onCapthaSubmit = () => {
    this.sendResendReq();
    this.setState({showRecaptcha: false});
  };

  hideChangeEmailForm = () => {
    this.setState({isChangeEmailFormVisible: false});
  };

  showChnageEmailSuccess = () => {
    this.setState({showChangeEmailSuccess: true});
    setTimeout(() => this.setState({showChangeEmailSuccess: false}), 2500);
  };

  handleChangeEmailForm = async values => {
    await this.props.changeEmail(values);
    this.hideChangeEmailForm();
    this.showChnageEmailSuccess();
  };

  sendResendReq = async () => {
    try {
      const res = await axios.get("/api/resendToken");
      const {data} = res;
      if (data.success) {
        this.setState({showResendSuccess: true});
        setTimeout(() => this.setState({showResendSuccess: false}), 2500);
      } else throw Error(data.message);
    } catch (err) {
      throw new SubmissionError({_error: err});
    }
  };
  resendConfirmToken = () => {
    let counts = this.state.resendCounts;
    if (counts > 0) {
      this.setState({showRecaptcha: true});
      return;
    }
    this.setState({resendCounts: counts + 1});
    this.sendResendReq();
  };

  render() {
    const {
      error,
      handleSubmit,
      submitting,
      confirmUser,
      auth,
      location
    } = this.props;
    const successMessage = message => {
      return (
        <Message positive style={{textAlign: "left"}}>
          <Icon name="check circle" color="green" />
          <span>{message}</span>
        </Message>
      );
    };
    return (
      <div>
        <PageHeader
          auth={auth}
          logout={this.logout}
          location={location}
        />

        <Grid
          textAlign="center"
          verticalAlign="middle"
          container
          style={{paddingTop: "3rem"}}
        >
          <Grid.Row>
            <Form onSubmit={handleSubmit(confirmUser)} error={!!error}>
              <h2>Welcome</h2>
              <p>Please enter the 4-digit code you received through email.</p>
              <Field
                name="pin"
                fluid
                component={InputComponent}
                normalize={normalizeNumber}
              />
              <Form.Button
                color="blue"
                style={{width: "125px"}}
                loading={submitting}
                disabled={submitting}
              >
                Send
              </Form.Button>
              {error && (
                <Message negative style={{textAlign: "left"}}>
                  <Icon name="times circle" color="red" />
                  <span>{error.message}</span>
                </Message>
              )}
              {this.state.showResendSuccess &&
                successMessage("Confirmation email sent")}
            </Form>
          </Grid.Row>
          <Grid.Row>
            <Button
              style={{width: "125px"}}
              disabled={this.state.showRecaptcha}
              onClick={this.resendConfirmToken}
            >
              Resend code
            </Button>
          </Grid.Row>
          {this.state.showRecaptcha ? (
            <Grid.Row>
              <ReCAPTCHA
                onChange={this.onCapthaSubmit}
                sitekey="6LeFZXUUAAAAAFMH7pU6uikLh7qyHWa1eJV1tOaP"
              />
            </Grid.Row>
          ) : null}
          <Grid.Row>
            {!this.state.isChangeEmailFormVisible ? (
              <a
                onClick={() => this.setState({isChangeEmailFormVisible: true})}
              >
                Change email
              </a>
            ) : null}
          </Grid.Row>
          {this.state.isChangeEmailFormVisible ? (
            <Grid.Row>
              <ChangeEmailForm
                onFormSubmit={this.handleChangeEmailForm}
                auth={auth}
                onNegativeClick={this.hideChangeEmailForm}
              />
            </Grid.Row>
          ) : null}
          {this.state.showChangeEmailSuccess && (
            <Grid.Row>
              {successMessage("Your email has been successfully changed")}
            </Grid.Row>
          )}
        </Grid>
      </div>
    );
  }
}

function mapStateToProps({auth, dashboard}) {
  return {auth, dashboard};
}

const connectedConfirmation = connect(mapStateToProps, actions)(Confirmation);

export default reduxForm({
  form: "confirmationForm",
  validate
})(connectedConfirmation);
