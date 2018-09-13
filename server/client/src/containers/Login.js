import React, { Component } from "react";
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

class Login extends Component {
  render() {
    console.log(this.props)
    return(
      <div className='login-form'>
         <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
           <Grid.Column style={{ maxWidth: 450 }}>
             <Header as='h2' color='teal' textAlign='center'>
               <Image src='/logo.png' /> Log-in to your account
             </Header>
             <Form size='large'>
               <Segment stacked>
                 <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' />
                 <Form.Input
                   fluid
                   icon='lock'
                   iconPosition='left'
                   placeholder='Password'
                   type='password'
                 />

                 <Button color='teal' fluid size='large'>
                   Login
                 </Button>
               </Segment>
             </Form>
             <Message>
               New to us? <a href='#'>Sign Up</a>
             </Message>
           </Grid.Column>
         </Grid>
       </div>
     )
  }

};


function mapStateToProps({ auth }) {
  return {auth};
}


export default connect(mapStateToProps)(Login);
