import React, { Fragment } from "react";
import { Form, Label, Input, Dropdown, Search } from 'semantic-ui-react'


export const InputComponent = ({input, label, meta: { touched, error, warning }, ...custom}) => (
  <Fragment>
    <Form.Field
    error={touched && !!error}
    style={{ textAlign:'left' }}>
      <Input
       style={{ marginBottom: '0px' }}
       {...input}
       {...custom}/>
       { touched && (error && <Label pointing color='red'>{error}</Label>) }
     </Form.Field>
   </Fragment>
)

export const SearchComponent = ({input, results, handleSearchChange, handleSelectResult, label, meta: { touched, error, warning }, ...custom}) => {
  return (
      <Fragment>
        <Form.Field
        error={touched && !!error}
        style={{ textAlign:'left' }}>
          <Search
           style={{ marginBottom: '0px', minWidth: '0' }}
           {...input}
           onSearchChange={ (e, { value }) => {
             input.onChange(value);
             handleSearchChange(value);
           } }
           onResultSelect={(e, {result}) => handleSelectResult('city', result.title)}
           onFocus={(e) => {
             //trick to disable autocomplete
             e.target.autocomplete = 'custom'
           }}
           results={results}
           {...custom}/>
           { touched && (error && <Label pointing color='red'>{error}</Label>) }
         </Form.Field>
       </Fragment>
    )
}




export const SelectComponent = ({input, label, meta: { touched, error, warning, active }, ...custom}) => {
  return (
      <Fragment>
        <Form.Field
        error={touched && !active && !!error }
        style={{ textAlign:'left' }}>
          <Dropdown
           style={{ marginBottom: '0px', minWidth: '0' }}
           {...input}
           onChange={(param,data) => input.onChange(data.value)}
           {...custom}/>
           { touched && !active && (error && <Label pointing color='red'>{error}</Label>) }
         </Form.Field>
       </Fragment>
    )
}
