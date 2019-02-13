import React, { useState } from "react";
import {Router, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import * as actions from "../actions";
import { Segment, Icon, Ref } from 'semantic-ui-react';
import { InputComponent } from '../helpers/common';
import { reduxForm, Field } from 'redux-form';
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
    paddingBottom: '10px'
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
  const {auth, dashboard, match} = props;
  const { user } = auth;
  const [name, setName] = useState(user.name);

  return (
    <Segment style={styles.container}>
     <div style={styles.box}>
      <div style={styles.title}>Name</div>
      <Field
       style={styles.field}
       name='name'
       placeholder='Type new name'
       component={InputComponent}
      />
     </div>
     <div style={styles.box}>
      <div style={styles.title}>Name</div>
      <Field
       style={styles.field}
       name='name'
       placeholder='Type new name'
       component={InputComponent}
      />
     </div>
     <div style={styles.box}>
      <div style={styles.title}>Nameasvasv</div>
      <Field
       style={styles.field}
       name='name'
       placeholder='Type new name'
       component={InputComponent}
      />
     </div>
     <div style={styles.box}>
      <div style={styles.title}>sdsvsd4</div>
      <Field
       style={styles.field}
       name='name'
       placeholder='Type new name'
       component={InputComponent}
      />
     </div>
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
