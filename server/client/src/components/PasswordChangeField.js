import React from "react";
import {InputComponent} from "../helpers/common";
import {Field} from "redux-form";
import {Grid} from "semantic-ui-react";

const passwordAliaces = {
  oldPassword: "Old password",
  password: "New password",
  repPassword: "Repeat new password"
};

const PasswordChangeField = props => {
  const {passwordFieldStatus, passwordField, styles, clearFields, form} = props;
  return (
    <Grid.Row style={styles.row}>
      <Grid.Column width={2} style={{textAlign: "left"}}>
        <div style={styles.title}>Password:</div>
      </Grid.Column>

      <Grid.Column width={6}>
        {passwordField.password
          ? Object.keys(passwordAliaces).map((field, i) => {
              return (
                <Grid.Row key={i}>
                  <Grid.Column width={6}>
                    <Field
                      style={{...styles.field, marginBottom: "5px"}}
                      name={field}
                      type="password"
                      placeholder={`${passwordAliaces[field]}`}
                      component={InputComponent}
                    />
                  </Grid.Column>
                </Grid.Row>
              );
            })
          : "******"}
      </Grid.Column>

      <Grid.Column width={2} style={{textAlign: "left"}}>
        <div>
          <a
            onClick={() => {
              clearFields(
                form,
                false,
                "oldPassword",
                "password",
                "repPassword"
              );
              passwordFieldStatus({password: !passwordField.password});
            }}
            style={styles.link}
          >
            {passwordField.password ? "Cancel" : "Change"}
          </a>
        </div>
      </Grid.Column>
    </Grid.Row>
  );
};

export default PasswordChangeField;
