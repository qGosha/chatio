import React, {useState} from "react";
import {connect} from "react-redux";
import {reduxForm, SubmissionError} from "redux-form";
import SignUpGrid from "../components/signUpGrid";
import * as actions from "../actions";
import {validate} from "../helpers/validation";

const Signup = props => {
  const [results, setResults] = useState([]);

  const submitForm = values => {
    const isCityPicked = results.some(i => i.title === values.city);
    if (!isCityPicked) {
      throw new SubmissionError({city: "Select your city"});
    }
    return props.signUpUser(values);
  };

  return (
    <SignUpGrid
      props={props}
      submitForm={submitForm}
      results={results}
      setResults={setResults}
    />
  );
};

function mapStateToProps({auth}) {
  return {auth};
}

const connectedSignup = connect(mapStateToProps, actions)(Signup);

export default reduxForm({
  form: "signupForm",
  validate
})(connectedSignup);
