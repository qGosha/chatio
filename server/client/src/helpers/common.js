import React, {Fragment} from "react";
import {Form, Label, Input, Dropdown, Search} from "semantic-ui-react";
import {DateInput} from "semantic-ui-calendar-react";

export const DatePickComponent = ({
  input,
  meta: {error, dirty, submitFailed},
  ...custom
}) => {
  const handleChange = (event, {value}) => {
    input.onChange(value);
  };
  return (
    <Form.Field
      error={(dirty || submitFailed) && !!error}
      style={{textAlign: "left"}}
    >
      <DateInput
        {...input}
        onChange={handleChange}
        onFocus={e => {
          return (e.target.autocomplete = "custom");
        }}
        placeholder="Date"
        iconPosition="left"
        closable={true}
        startMode="year"
        readonly={true}
        {...custom}
        dateFormat="MM-DD-YYYY"
        minDate="01-01-1900"
      />
      {(dirty || submitFailed) &&
        error && (
          <Label pointing color="red">
            {error}
          </Label>
        )}
    </Form.Field>
  );
};

export const InputComponent = ({
  input,
  meta: {error, dirty, submitFailed},
  ...custom
}) => (
  <Fragment>
    <Form.Field
      error={(dirty || submitFailed) && !!error}
      style={{textAlign: "left"}}
    >
      <Input style={{marginBottom: "0px"}} {...input} {...custom} />
      {(dirty || submitFailed) &&
        error && (
          <Label pointing color="red">
            {error}
          </Label>
        )}
    </Form.Field>
  </Fragment>
);

export const SearchComponent = ({
  input,
  results,
  handleSearchChange,
  handleSelectResult,
  meta: {error, dirty, submitFailed},
  ...custom
}) => {
  return (
    <Fragment>
      <Form.Field
        error={(dirty || submitFailed) && !!error}
        style={{textAlign: "left"}}
      >
        <Search
          style={{marginBottom: "0px", minWidth: "0"}}
          {...input}
          onSearchChange={(e, {value}) => {
            input.onChange(value);
            handleSearchChange(value);
          }}
          onResultSelect={(e, {result}) =>
            handleSelectResult("city", result.title)
          }
          onFocus={e => {
            //trick to disable autocomplete
            e.target.autocomplete = "custom";
          }}
          results={results}
          {...custom}
        />
        {(dirty || submitFailed) &&
          (error && (
            <Label pointing color="red">
              {error}
            </Label>
          ))}
      </Form.Field>
    </Fragment>
  );
};

export const SelectComponent = ({
  input,
  meta: {touched, error, active},
  ...custom
}) => {
  return (
    <Fragment>
      <Form.Field
        error={touched && !active && !!error}
        style={{textAlign: "left"}}
      >
        <Dropdown
          style={{marginBottom: "0px"}}
          {...input}
          onChange={(param, data) => input.onChange(data.value)}
          {...custom}
        />
        {touched &&
          !active &&
          (error && (
            <Label pointing color="red">
              {error}
            </Label>
          ))}
      </Form.Field>
    </Fragment>
  );
};
