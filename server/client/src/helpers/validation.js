export const validate = (values, props) => {
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
  if (!values.birthDay) {
   errors.birthDay = 'Select day'
  }
  if (!values.birthMonth) {
   errors.birthMonth = 'Select month'
  }
  if (!values.birthYear) {
   errors.birthYear = 'Select year'
  }
  if (!values.gender) {
   errors.gender = 'Select your gender'
  }
  if (!values.name) {
   errors.name = 'Enter your name'
 } else if ( !(/^[A-Za-z]+$/g).test(values.name) ) {
   errors.name = 'Name field cannot contain numbers or symbols'
 } else if ( values.name.length === 1 ) {
   errors.name = 'Name is too short'
 }
 if (!values.pin) {
   errors.pin = 'Required'
 } else if (values.pin.length < 4) {
    errors.pin = 'Pin must be 4 characters long'
 }
  return errors
};

export const pinValidate = (values, props) => {
  const errors = {};
  if (!values.pin) {
    errors.pin = 'Required'
  } else if (values.pin.length < 4) {
     errors.pin = 'Pin must be 4 characters long'
  }
  return errors;

}
