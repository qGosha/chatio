import React, {useState} from "react";
import {connect} from "react-redux";
import * as actions from "../actions";
import {Segment, Form, Grid} from "semantic-ui-react";
import {InputComponent, DatePickComponent} from "../helpers/common";
import {reduxForm, Field} from "redux-form";
import {validate} from "../helpers/validation";
import SearchCity from "../components/SearchCity";
import SelectGender from "../components/SelectGender";

const styles = {
  container: {
    gridColumn: "2 / 4",
    // display: "grid"
    // gridTemplateColumns: 'auto auto auto'
  },
  box: {
    // display: "flex",
    // justifyContent: "space-between",
    // borderBottom: "1px solid #ecdcdc",
    // padding: "10px"
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
    dashboard,
    match,
    error,
    submitting,
    handleSubmit,
    form,
    formValues,
    change
  } = props;
  console.log(formValues);
  const {user} = auth;
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
      <Grid.Column width={3} style={{textAlign:'left'}}>
        <div style={styles.title}>{`${aliaces[field]}:`}</div>
      </Grid.Column>
      <Grid.Column width={10}>
        {value ? component : <div>{user[field] ? user[field] : ""}</div>}
      </Grid.Column>
      <Grid.Column width={3} style={{textAlign:'left'}}>
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
  return (
      <Form
        size="large"
        onSubmit={handleSubmit(values => console.log(values))}
        error={!!error}
        style={styles.container}
      >
      <Grid
       textAlign="center"
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
};

function mapStateToProps({auth, dashboard}) {
  return {auth, dashboard};
}

const ConnectedSettings = connect(mapStateToProps, actions)(Settings);

export default reduxForm({
  form: "settingsForm",
  validate
})(ConnectedSettings);
