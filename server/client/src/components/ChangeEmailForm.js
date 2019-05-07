import React from "react"
import { Form, Message, Icon, Button } from "semantic-ui-react"
import { reduxForm, Field } from "redux-form"
import { InputComponent } from "../helpers/common"
import { validate } from "../helpers/validation"

const ChangeEmailForm = props => {
  const {
    error,
    handleSubmit,
    submitting,
    onFormSubmit,
    auth,
    onNegativeClick
  } = props
  const currentEmail = auth.user.email
  return (
    <Form onSubmit={handleSubmit(onFormSubmit)} error={!!error}>
      <Field
        name="email"
        fluid
        component={InputComponent}
        placeholder={currentEmail}
      />
      <p style={{ fontStyle: "italic", fontSize: "12px", color: "gray" }}>
        *You will receive a new code to the new email
      </p>
      <Button.Group>
        <Button
          type="submit"
          primary
          style={{ width: "125px" }}
          loading={submitting}
          disabled={submitting}
        >
          Change
        </Button>
        <Button icon="times" negative type="reset" onClick={onNegativeClick} />
      </Button.Group>
      {error && (
        <Message negative style={{ textAlign: "left" }}>
          <Icon name="times circle" color="red" />
          <span>{error.message}</span>
        </Message>
      )}
    </Form>
  )
}

export default reduxForm({
  form: "changeEmailForm",
  validate
})(ChangeEmailForm)
