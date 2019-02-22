const moment = require('moment');
export const validate = (values) => {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const errors = {}
  if (!values.email) {
    errors.email = 'Required'
  } else if (!reg.test(values.email)) {
     errors.email = 'Wrong email format'
    }
  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < 6) {
     errors.password = 'Password must be more than 6 characters'
  }
  if (!values.repPassword) {
    errors.repPassword = 'Required'
  } else if (values.password !== values.repPassword) {
     errors.repPassword = 'Passwords don\'t match'
  }
  if (!values.oldPassword) {
    errors.oldPassword = 'Required'
  }
  if (!values.dateOfBirth) {
   errors.dateOfBirth = 'Select your date of birth'
 } else if (!moment(values.dateOfBirth, 'MM-DD-YYYY', true).isValid()) {
   errors.dateOfBirth = 'Incorrect date'
 } else if (new Date(values.dateOfBirth).getFullYear() < 1900) {
   errors.dateOfBirth = 'Incorrect date'
 } else if (moment(values.dateOfBirth).isAfter(new Date())) {
   errors.dateOfBirth = 'The date is in the future'
 }
  if (!values.gender) {
   errors.gender = 'Select your gender'
  }
  if (!values.name) {
   errors.name = 'Enter your name'
 } else if ( !(/^[A-Za-z0-9]+$/g).test(values.name) ) {
   errors.name = 'Name field cannot contain symbols'
 } else if ( values.name.length === 1 ) {
   errors.name = 'Name is too short'
 } else if ( values.name.length > 10 ) {
   errors.name = 'Name is too long'
 }
 if (!values.pin) {
   errors.pin = 'Required'
 } else if (values.pin.length < 4) {
    errors.pin = 'Pin must be 4 characters long'
 }
  return errors
};
