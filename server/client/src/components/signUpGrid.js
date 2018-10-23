import React from "react";
import { InputComponent, SelectComponent, SearchComponent } from '../helpers/common';
import { Form, Grid, Header, Message, Segment, Icon } from 'semantic-ui-react';
import {  Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SocialButtons from '../components/socialButtons';



const SignUpGrid = ({submitForm, monthOptions, yearOptions, dayOptions, genderOptions, handleSearchChange, results, props}) => {
  const { error, handleSubmit, submitting, showLoadingScreen } = props;
  const label = {
    display: 'block',
    margin: '0 0 .28571429rem 0',
    color: 'rgba(0,0,0,.87)',
    fontSize: '.92857143em',
    fontWeight: '700',
    textAlign: 'left'
  }
  return (
    <Grid textAlign='center' verticalAlign='middle' container stackable divided  columns='equal' relaxed style={{paddingTop: '3rem'}}>
     <Grid.Row>
      <Grid.Column>
        <Header as='h2' color='teal' textAlign='center'>
        Create new account
        </Header>
        <Form
          size='large'
          onSubmit={handleSubmit(submitForm)}
          error={!!error}>
          <Segment stacked>
          <span style={label}>
           Name
          </span>
          <Field
           name='name'
           placeholder='Your first name'
           fluid
           component={InputComponent}
          />
          <span style={label}>
           Gender
          </span>
          <Field
           name='gender'
           options={genderOptions}
           selection
           placeholder='Select your gender'
           fluid
           component={SelectComponent}
          />
           <span style={label}>
            Birthday
           </span>
          <Form.Group widths='equal' style={{flexWrap:'nowrap'}}>
            <Field
             fluid
             search
             name='birthDay'
             options={dayOptions}
             selection
             placeholder='Day'
             component={SelectComponent}
            />
            <Field
            fluid
             search
             name='birthMonth'
             options={monthOptions}
             selection
             placeholder='Month'
             component={SelectComponent}
            />
            <Field
            fluid
             search
             name='birthYear'
             options={yearOptions}
             selection
             placeholder='Year'
             component={SelectComponent}
            />
          </Form.Group>
          <span style={label}>
           Your city
          </span>
          <Field
           handleSelectResult={props.change}
           handleSearchChange={handleSearchChange}
           fluid
           name='city'
           results={results}
           placeholder='Type your city name'
           component={SearchComponent}
          />
          <span style={label}>
           Email
          </span>
          <Field
           name="email"
           fluid
           icon='user'
           iconPosition='left'
           placeholder='E-mail address'
           component={InputComponent}
          />
          <span style={label}>
           Password
          </span>
          <Field
            fluid
            name="password"
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
            component={InputComponent}
          />
          <span style={label}>
           Repeat your password
          </span>
          <Field
            fluid
            name="repPassword"
            icon='lock'
            iconPosition='left'
            placeholder='Repeat your password'
            type='password'
            component={InputComponent}
          />
            <Form.Button
              color='blue'
              fluid size='large'
              loading={submitting}
              disabled={submitting}>
              Sign up
            </Form.Button>
          </Segment>
          { error && ( <Message negative style={{textAlign: 'left'}}>
            <Icon name='times circle' color='red'/>
            <span>{error.message}</span>
          </Message>) }
        </Form>
        <Message>
          Already have an account? <Link to='/login'>Sign in</Link>
        </Message>
      </Grid.Column>
      <Grid.Column>
       <SocialButtons showLoadingScreen={showLoadingScreen} />
      </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default SignUpGrid;
