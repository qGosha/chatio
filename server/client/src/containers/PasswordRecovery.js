import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { reduxForm, Field, SubmissionError } from "redux-form"
import { InputComponent } from "../helpers/common"
import { Form, Grid, Header, Message, Segment, Icon } from "semantic-ui-react"
import * as actions from "../actions"
import { validate } from "../helpers/validation"
import axios from "axios"

const ResetPassword = ({
  error,
  handleSubmit,
  submitting,
  clearFields,
  form,
  submitSucceeded
}) => {
  const sendLink = async value => {
    try {
      const res = await axios.post("/api/reset_password_email", value)
      const { data } = res
      if (data.success) {
        clearFields(form, false, "email")
      } else throw Error(data.message)
    } catch (err) {
      throw new SubmissionError({ _error: err })
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
      <Grid.Row style={{ maxWidth: "500px" }}>
        <Grid.Column>
          <Header
            as="h2"
            color="teal"
            textAlign="center"
            style={{ marginTop: "2rem" }}
          >
            Reset your password
          </Header>
          <Form size="large" onSubmit={handleSubmit(sendLink)} error={!!error}>
            <Segment stacked style={{ fontSize: "16px" }}>
              <Field
                name="email"
                fluid
                icon="user"
                iconPosition="left"
                title="Enter your email address"
                placeholder="E-mail address"
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
              <Message positive style={{ textAlign: "left" }}>
                <Icon name="check circle" color="green" />
                <span>
                  Success! A password reset email has been sent to your email
                </span>
              </Message>
            )}
            {error && (
              <Message negative style={{ textAlign: "left" }}>
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
  )
}

const ConnectedResetPassword = connect(
  null,
  actions
)(ResetPassword)

export default reduxForm({
  form: "resetPassword",
  validate
})(ConnectedResetPassword)
