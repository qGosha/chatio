import React, { useState } from "react";
import {connect} from "react-redux";
import * as actions from "../actions";
import { Segment, Form } from 'semantic-ui-react';
import { InputComponent, DatePickComponent } from '../helpers/common';
import { reduxForm, Field } from 'redux-form';
import { validate } from '../helpers/validation';
import SearchCity from "../components/SearchCity";
import SelectGender from "../components/SelectGender";

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
  const {auth, dashboard, match, error, submitting, handleSubmit, form, formValues, change} = props;
  console.log(formValues);
  const { user } = auth;
  // const { name, email, gender, dateOfBirth, city } = user;
  const aliaces = {
    name: 'Name',
    email: 'Email',
    gender: 'Gender',
    city: 'City',
    dateOfBirth: 'Date of birth'
  }
 const [results, setResults] = useState([]);

  const [settingsStatus, settingsStatusChange] = useState({
    name: false,
    email: false,
    gender: false,
    city: false,
    dateOfBirth: false
  });
  const fields = Object.keys(settingsStatus).map( (field, i) => {
    const value = settingsStatus[field];
    let component = null;
     if (field === 'city') {
       component = (
         <SearchCity
         change={props.change}
         setResults={setResults}
         results={results}
         />
       );
     } else if (field === 'gender') {
       component = <SelectGender />;
     } else if (field === 'dateOfBirth') {
       component = (<Field
              name={'dateOfBirth'}
              placeholder={`Type new date`}
              component={DatePickComponent}
             />)
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
      <div key={i} style={styles.box}>
        <div style={styles.title}>{`${aliaces[field]}:`}</div>
         { value ? component :
           <div>
            { user[field] ? user[field] : '' }
           </div>
             }
         <div><a onClick={ () => {
        if(value) {
          if (settingsStatus.city) {
            setResults([]);
          }
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


function mapStateToProps({auth, dashboard}) {
  return {auth, dashboard};
}

const ConnectedSettings = connect(mapStateToProps, actions)(Settings);

export default reduxForm({
    form: 'settingsForm',
    validate
})(ConnectedSettings);
