import React, {useState} from "react";
import {connect} from "react-redux";
import * as actions from "../actions";
import {Segment, Form, Grid, Image, Tab} from "semantic-ui-react";
import {InputComponent, DatePickComponent} from "../helpers/common";
import {reduxForm, Field, SubmissionError} from "redux-form";
import {validate} from "../helpers/validation";
import SearchCity from "../components/SearchCity";
import SelectGender from "../components/SelectGender";
import FileButton from "../components/FileButton";

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
    match,
    error,
    submitting,
    handleSubmit,
    form,
    formValues,
    change,
    standartImage
  } = props;
  console.log(formValues);
  const {user} = auth;
  const {isAvatarUploading, isSettingsUploading} = settings;
  const myAvatar = user.photos.length ? user.photos[0] : standartImage;
  // const { name, email, gender, dateOfBirth, city } = user;
  const aliaces = {
    name: "Name",
    email: "Email",
    gender: "Gender",
    city: "City",
    dateOfBirth: "Date of birth"
  };
  const [results, setResults] = useState([]);

  const [settingsStatus, settingsStatusChange] = useState({
    name: false,
    email: false,
    gender: false,
    city: false,
    dateOfBirth: false
  });

  const submitForm = values => {
    if (values.hasOwnProperty('city')) {
      const isCityPicked = results.some(i => i.title === values.city);
      if (!isCityPicked) {
        throw new SubmissionError({city: "Select your city"});
      }
    }
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
      size="large"
      onSubmit={handleSubmit(submitForm)}
      error={!!error}
    >
    <Grid
     textAlign="left"
     stackable>
        {fields}
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
