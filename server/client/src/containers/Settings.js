import React, { useState } from "react";
import {connect} from "react-redux";
import * as actions from "../actions";
import { Segment, Form } from 'semantic-ui-react';
import { InputComponent } from '../helpers/common';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { validate } from '../helpers/validation';

const styles = {
  container: {
    gridColumn: '2 / 5',
    display: 'grid',
    // gridTemplateColumns: 'auto auto auto'
  },
  box: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ecdcdc',
    padding: '10px'
  },
  title: {
    // marginRight: '5em'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',

  }
}

const Settings = props => {
  const {auth, dashboard, match, error, submitting, handleSubmit, form, formValues} = props;
  console.log(formValues);
  const { user } = auth;
  const { name, email, gender, dateOfBirth } = user;
  const [settings, setSetting] = useState({
    Name: name,
    Email: email,
    Gender: gender,
    'Date of birth': dateOfBirth
  });
  const [settingsStatus, settingsStatusChange] = useState({
    Name: false,
    Email: false,
    Gender: false,
    'Date of birth': false
  });
  const fields = Object.keys(settingsStatus).map( (field, i) => {
    if (!settings[field]) return null;
    const value = settingsStatus[field];
    return (
      <div key={i} style={styles.box}>
        <div style={styles.title}>{`${field}:`}</div>
         { value ?
           <Field
            style={styles.field}
            name={field}
            placeholder={`Type new ${field}`}
            component={InputComponent}
           /> :
           <div>
            {settings[field]}
           </div>
             }
         <div><a onClick={ () => {
        if(value) {
          props.clearFields(form, false, field);
        }
         settingsStatusChange({...settingsStatus, [field]: !value})
       } }>{ value ? 'Cancel' : 'Change' }</a></div>
      </div>
    )
  } )
  return (
    <Segment style={styles.container}>
    <Form
      size='large'
      onSubmit={handleSubmit((values)=> console.log(values))}
      error={!!error}>
      { fields }
     <Form.Button
       color='blue'
       fluid size='large'
       loading={submitting}
       disabled={submitting}>
        Save
     </Form.Button>
     </Form>
    </Segment>
  )
};

const mapStateToProps = state => {
  return {
    formValues: getFormValues('settingsForm')(state),
    auth: state.auth,
    dashboard: state.dashboard
  }
}

// function mapStateToProps({auth, dashboard}) {
//   return {auth, dashboard};
// }

const ConnectedSettings = connect(mapStateToProps, actions)(Settings);

// ConnectedSettings=connect( state => {
//   values: getFormValues('settingsForm')(state)
// } )(ConnectedSettings)

export default reduxForm({
    form: 'settingsForm',
    validate
})(ConnectedSettings);
