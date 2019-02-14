import React, { useState } from "react";
import axios from "axios";
import {connect} from "react-redux";
import {reduxForm, SubmissionError} from "redux-form";
import SignUpGrid from "../components/signUpGrid";
import * as actions from "../actions";
import {validate} from "../helpers/validation";
import debounce from "lodash.debounce";

const Signup = props => {

  const [results, setResults] = useState([]);

  const submitForm = values => {
    const isCityPicked = results.some(i => i.title === values.city);
    if (!isCityPicked) {
      throw new SubmissionError({city: "Select your city"});
    }
    return props.signUpUser(values);
  };

    let dayOptions = [];
    for (let i = 1; i <= 31; i++) {
      const day = {
        key: i,
        text: i,
        value: i
      };
      dayOptions.push(day);
    }
    let yearOptions = [];
    for (let i = 2000; i >= 1915; i--) {
      const day = {
        key: i,
        text: i,
        value: i
      };
      yearOptions.push(day);
    }
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let monthOptions = [];
    for (let i = 0; i <= months.length - 1; i++) {
      const day = {
        key: months[i],
        text: months[i],
        value: months[i]
      };
      monthOptions.push(day);
    }

    return (
      <SignUpGrid
        props={props}
        submitForm={submitForm}
        monthOptions={monthOptions}
        yearOptions={yearOptions}
        dayOptions={dayOptions}
        results={results}
        setResults={setResults}
      />
    );
}

function mapStateToProps({auth}) {
  return {auth};
}

const connectedSignup = connect(
  mapStateToProps,
  actions
)(Signup);

export default reduxForm({
  form: "signupForm",
  validate
})(connectedSignup);
