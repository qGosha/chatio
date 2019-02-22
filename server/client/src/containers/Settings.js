import React, {useState} from "react";
import {connect} from "react-redux";
import * as actions from "../actions";
import {Segment, Form, Grid, Image, Tab, Message, Icon} from "semantic-ui-react";
import {InputComponent, DatePickComponent} from "../helpers/common";
import {reduxForm, Field, SubmissionError} from "redux-form";
import {validate} from "../helpers/validation";
import SearchCity from "../components/SearchCity";
import SelectGender from "../components/SelectGender";
import FileButton from "../components/FileButton";
const moment = require('moment');
const omit = require('lodash.omit');
const styles = {
  container: {
    gridColumn: "2 / 5",
    // display: "grid"
    // gridTemplateColumns: 'auto auto auto'
  },
  title: {
    // marginRight: '5em'
  },
  field: {
    // marginTop: '15px'
  },
  saveButton: {
    marginTop: '30px'
  },
  row: {
    borderBottom: '0.5px solid #a9a4a4a6'
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
    standartImage
  } = props;

  const { user } = auth;
  if (user.dateOfBirth) {
    user.dateOfBirth = moment(user.dateOfBirth).format('YYYY-MM-DD');
  }
  const { isAvatarUploading } = settings;
  const myAvatar = user.photos.length ? user.photos[0] : standartImage;

  const aliaces = {
    name: "Name",
    email: "Email",
    gender: "Gender",
    city: "City",
    dateOfBirth: "Date of birth"
  };
  const passwordAliaces = {
    oldPassword: 'Old password',
    password: 'New password',
    repPassword: 'Repeat new password'
  };
  const [results, setResults] = useState([]);
  const defualtSettingsPositions = {
    name: false,
    email: false,
    gender: false,
    city: false,
    dateOfBirth: false,
  }
  const [passwordField, passwordFieldStatus] = useState(false);
  const [settingsStatus, settingsStatusChange] = useState(defualtSettingsPositions);

  const submitForm = values => {
    const valArr = Object.keys(values);
    if (!valArr.length) return;
    if (values.hasOwnProperty('city')) {
      const isCityPicked = results.some(i => i.title === values.city);
      if (!isCityPicked) {
        throw new SubmissionError({city: "Select your city"});
      }
    }
    if (values.hasOwnProperty('repPassword')) {
      values = omit(values, ['repPassword']);
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
          style={styles.field}
        />
      );
    } else if (field === "gender") {
      component = <SelectGender style={styles.field}/>;
    } else if (field === "dateOfBirth") {
      component = (
        <Field
          name={"dateOfBirth"}
          placeholder={`Type new date`}
          component={DatePickComponent}
          style={styles.field}
        />
      );
    } else {
      if (field === "email" && user.isOauth) {
        return;
      }
      component = (
        <Field
          style={styles.field}
          name={field}
          placeholder={`Type new ${aliaces[field]}`}
          component={InputComponent}
        />
      );
    }
    return (
    <Grid.Row key={i} style={styles.row}>
      <Grid.Column width={2} style={{textAlign:'left'}}>
        <div style={styles.title}>{`${aliaces[field]}:`}</div>
      </Grid.Column>
      <Grid.Column width={6}>
        {value ? component : <div>{user[field] ? user[field] : ""}</div>}
      </Grid.Column>
      <Grid.Column width={2} style={{textAlign:'left'}}>
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
    <Grid
     textAlign="left"
     stackable>
        {fields}

        <Grid.Row style={styles.row}>
          <Grid.Column width={2} style={{textAlign:'left'}}>
            <div style={styles.title}>Password:</div>
          </Grid.Column>

          <Grid.Column width={6}>
           { passwordField.password ?
             Object.keys(passwordAliaces).map( (field, i) => {
               return (
                 <Grid.Row key={i}>
                   <Grid.Column width={6}>
                   <Field
                     style={{...styles.field, marginBottom: '5px'}}
                     name={field}
                     type="password"
                     placeholder={`${passwordAliaces[field]}`}
                     component={InputComponent}
                   />
                   </Grid.Column>
                 </Grid.Row>
               )

             }) : '******'
           }
          </Grid.Column>

          <Grid.Column width={2} style={{textAlign:'left'}}>
            <div>
              <a
                onClick={() => {
                    props.clearFields(form, false, 'oldPassword', 'password', 'repPassword');
                    passwordFieldStatus({password: !passwordField.password});
                }}
              >
                {passwordField.password? "Cancel" : "Change"}
              </a>
            </div>
        </Grid.Column>
        </Grid.Row>



      </Grid>
      <Form.Button
        color="blue"
        size="large"
        loading={submitting}
        disabled={submitting}
        style={styles.saveButton}
      >
        Save
      </Form.Button>
      {error && (
        <Message negative style={{textAlign: "left"}}>
          <Icon name="times circle" color="red" />
          <span>{error.message}</span>
        </Message>
      )}
    </Form>
  );
  const avatarPane = (
    <Grid
     stackable>
      <Grid.Column>
       <Segment>
        <Image rounded size='small' verticalAlign='top' src={myAvatar} />
        <FileButton
          onSelect={props.changeAvatar}
          primary
          style={{marginTop: '1em'}}
          disabled={isAvatarUploading}
          loading={isAvatarUploading}
          />
       </Segment>
      </Grid.Column>
    </Grid>
  )
  const panes = [
  { menuItem: 'General', render: () => <Tab.Pane>{generalPane}</Tab.Pane> },
  { menuItem: 'Avatar', render: () => <Tab.Pane>{avatarPane}</Tab.Pane> }
]
  return (
    <Tab panes={panes} style={styles.container}/>
  );
};

function mapStateToProps({auth, settings}) {
  return {auth, settings};
}

const ConnectedSettings = connect(mapStateToProps, actions)(Settings);

export default reduxForm({
  form: "settingsForm",
  validate
})(ConnectedSettings);
