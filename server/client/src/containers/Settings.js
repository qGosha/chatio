import React, {useState, Fragment, useEffect} from "react";
import {connect} from "react-redux";
import * as actions from "../actions";
import ModalWindow from "../components/modal";
import {
  Segment,
  Form,
  Grid,
  Image,
  Tab,
  Message,
  Icon,
  Button,
  Checkbox
} from "semantic-ui-react";
import {InputComponent, DatePickComponent} from "../helpers/common";
import {reduxForm, Field, SubmissionError} from "redux-form";
import {validate} from "../helpers/validation";
import SearchCity from "../components/SearchCity";
import SelectGender from "../components/SelectGender";
import FileButton from "../components/FileButton";
import PasswordChangeField from "../components/PasswordChangeField";
const moment = require("moment");
const omit = require("lodash.omit");
const styles = {
  container: {
    fontFamily: "Roboto, sans-serif",
    gridArea: 'menu / main / main / main'
  },
  saveButton: {
    marginTop: "30px"
  },
  row: {
    borderBottom: "0.5px solid #a9a4a4a6"
  },
  messages: {
    position: "fixed",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "left"
  },
  link: {
    fontWeight: "600",
    fontStyle: "italic",
    fontSize: "12px"
  }
};

const Settings = props => {
  const {
    auth,
    settings,
    error,
    submitting,
    handleSubmit,
    form,
    standartImage,
    deleteUser,
    clearSubmitErrors
  } = props;

  const {user} = auth;
  if (user.dateOfBirth) {
    user.dateOfBirth = moment(user.dateOfBirth).format("YYYY-MM-DD");
  }
  const {isAvatarUploading, showSuccessUpdate} = settings;
  const myAvatar = user.photos.length ? user.photos[0] : standartImage;

  const aliaces = {
    name: "Name",
    email: "Email",
    gender: "Gender",
    city: "City",
    dateOfBirth: "Date of birth"
  };
  const [modalOpen, modalStatusChange] = useState(false);
  const [results, setResults] = useState([]);
  const defualtSettingsPositions = {
    name: false,
    email: false,
    gender: false,
    city: false,
    dateOfBirth: false
  };
  const [passwordField, passwordFieldStatus] = useState(false);
  const [settingsStatus, settingsStatusChange] = useState(
    defualtSettingsPositions
  );

  useEffect(
    () => {
      let timer;
      if (error && error.message) {
        timer = setTimeout(() => {
          console.log(submitting);
          clearSubmitErrors(form);
        }, 1500);
      }
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    },
    [submitting]
  );

  const submitForm = values => {
    const valArr = Object.keys(values);
    if (!valArr.length) return;
    if (values.hasOwnProperty("city")) {
      const isCityPicked = results.some(i => i.title === values.city);
      if (!isCityPicked) {
        throw new SubmissionError({city: "Select your city"});
      }
    }
    if (values.hasOwnProperty("repPassword")) {
      values = omit(values, ["repPassword"]);
    }
    settingsStatusChange(defualtSettingsPositions);
    passwordFieldStatus({password: false});
    props.clearFields(form, false, ...valArr);
    return props.changeSettings(values);
  };

  const fields = Object.keys(settingsStatus).map((field, i) => {
    const value = settingsStatus[field];
    let component = null;
    if (field === "city") {
      component = (
        <SearchCity
          change={props.change}
          setResults={setResults}
          results={results}
        />
      );
    } else if (field === "gender") {
      component = <SelectGender />;
    } else if (field === "dateOfBirth") {
      component = (
        <Field
          name={"dateOfBirth"}
          placeholder={`Type new date`}
          component={DatePickComponent}
        />
      );
    } else {
      if (field === "email" && user.isOauth) {
        return;
      }
      component = (
        <Field
          name={field}
          placeholder={`Type new ${aliaces[field]}`}
          component={InputComponent}
        />
      );
    }
    return (
      <Grid.Row key={i} style={styles.row}>
        <Grid.Column width={2} style={{textAlign: "left"}}>
          <div style={styles.title}>{`${aliaces[field]}:`}</div>
        </Grid.Column>
        <Grid.Column width={6}>
          {value ? component : <div>{user[field] ? user[field] : ""}</div>}
        </Grid.Column>
        <Grid.Column width={2} style={{textAlign: "left"}}>
          <div>
            <a
              onClick={() => {
                if (value) {
                  if (settingsStatus.city) {
                    setResults([]);
                  }
                  props.clearFields(form, false, field);
                }
                settingsStatusChange({...settingsStatus, [field]: !value});
              }}
              style={styles.link}
            >
              {value ? "Cancel" : "Change"}
            </a>
          </div>
        </Grid.Column>
      </Grid.Row>
    );
  });

  const generalPane = (
    <Form
      loading={submitting}
      size="large"
      onSubmit={handleSubmit(submitForm)}
      error={!!error}
    >
      <Grid textAlign="left" stackable>
        {fields}
        {!user.isOauth ? (
          <PasswordChangeField
            passwordField={passwordField}
            passwordFieldStatus={passwordFieldStatus}
            styles={styles}
            clearFields={props.clearFields}
            form={form}
          />
        ) : null}
        <Grid.Row style={{justifyContent: "flex-end"}}>
          <Grid.Column width={5} style={{textAlign: "right"}}>
            <Button
              negative
              onClick={() => modalStatusChange(true)}
              type="reset"
            >
              <Icon name="trash alternate" />
              Delete account
            </Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8} style={{textAlign: "left"}}>
            <div style={styles.title}>Mute notifications:</div>
          </Grid.Column>
          <Grid.Column width={2} style={{textAlign: "left"}}>
            <Field
              name={"mute"}
              component={({input: {value, onChange, ...input}}) => {
                return (
                  <Form.Field>
                    <Checkbox
                      {...input}
                      type="checkbox"
                      onChange={(e, data) => onChange(data.checked)}
                      defaultChecked={!!value}
                      toggle
                    />
                  </Form.Field>
                );
              }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Button
        type="submit"
        primary
        size="large"
        loading={submitting}
        disabled={submitting}
        style={styles.saveButton}
      >
        Save
      </Button>
      {error && (
        <Message negative size="small" style={styles.messages}>
          <Icon name="times circle" color="red" />
          <span>{error.message}</span>
        </Message>
      )}
      {showSuccessUpdate && (
        <Message positive size="small" style={styles.messages}>
          <Icon name="check circle" color="green" />
          <span>Settings were successfully updated</span>
        </Message>
      )}
    </Form>
  );
  const avatarPane = (
    <Grid stackable>
      <Grid.Column>
        <Segment>
          <Image rounded size="small" verticalAlign="top" src={myAvatar} />
          <FileButton
            onSelect={props.changeAvatar}
            primary
            style={{marginTop: "1em"}}
            disabled={isAvatarUploading}
            loading={isAvatarUploading}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
  const panes = [
    {menuItem: "General", render: () => <Tab.Pane>{generalPane}</Tab.Pane>},
    {menuItem: "Avatar", render: () => <Tab.Pane>{avatarPane}</Tab.Pane>}
  ];
  return (
    <Fragment>
      <ModalWindow
        open={modalOpen}
        onClose={() => modalStatusChange(false)}
        headertext={"Delete Your Account"}
        contenttext={"Are you sure you want to delete your account?"}
        onNegative={() => modalStatusChange(false)}
        onPositive={() => deleteUser()}
      />
      <Tab panes={panes} style={styles.container} />
    </Fragment>
  );
};

const ConnectedSettings = reduxForm({
  form: "settingsForm",
  validate
})(Settings);

function mapStateToProps({auth, settings}) {
  return {
    auth,
    settings,
    initialValues: {
      mute: auth.user.mute
    }
  };
}

export default connect(mapStateToProps, actions)(ConnectedSettings);
