import React, { Component } from "react";
import axios from 'axios';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {  reduxForm, Field, SubmissionError, registerField } from 'redux-form';
import SignUpGrid from '../components/signUpGrid'
import * as actions from '../actions';
import { validate } from '../helpers/validation';
import debounce from 'lodash.debounce';

class Signup extends Component {
    state = {
      results : []
    };

  searchCity = this.searchCity.bind(this);
  onDebouncedInput = debounce(this.searchCity, 300, {'leading': true});

  async searchCity(value) {
   const res = await axios.post('/api/search/city', { value });
   const { data } = res;
   if(data.success && data.results.length > 0) {
     const results = data.results.map( i => {
       i = {
         ...i,
         key: i.id,
         title: i.description,
         description: ''
       }
       return i;
     } )
     this.setState({results})
   }
 }
 handleSearchChange = (value) => {
   if(!value) {
     this.setState({results:[]});
     return;
   }
   this.onDebouncedInput(value);
 }

submitForm = (values) => {
  console.log(values);
  const { results } = this.state;
  const isCityPicked = results.some( i => i.title === values.city);
  if (!isCityPicked) {
    throw new SubmissionError({ city: 'Select your city' });
  }
   return this.props.signUpUser(values);
}

  render() {
    const genderOptions = [
      { key: 'm', text: 'Male', value: 'male' },
      { key: 'f', text: 'Female', value: 'female' },
    ];
    let dayOptions = [];
    for(let i = 1; i <= 31; i++) {
      const day = {
        key: i,
        text: i,
        value: i
      }
      dayOptions.push(day);
    };
    let yearOptions = [];
    for(let i = 2000; i >= 1915; i--) {
      const day = {
        key: i,
        text: i,
        value: i
      }
      yearOptions.push(day);
    };
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let monthOptions = [];
    for(let i = 0; i <= months.length-1; i++) {
      const day = {
        key: months[i],
        text: months[i],
        value: months[i]
      }
      monthOptions.push(day);
    };

    return(
       <SignUpGrid
        props={this.props}
        submitForm={this.submitForm}
        monthOptions={monthOptions}
        yearOptions={yearOptions}
        dayOptions={dayOptions}
        genderOptions={genderOptions}
        handleSearchChange={this.handleSearchChange}
        results={this.state.results}
        />
     )
  }

};


function mapStateToProps({ auth }) {
  return {auth};
}


Signup = connect(mapStateToProps, actions)(Signup);

export default reduxForm({
    form: 'signupForm',
    validate
})(Signup);
