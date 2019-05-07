import React from "react"
import { SelectComponent } from "../helpers/common"
import { Field } from "redux-form"

const SelectGender = props => {
  const genderOptions = [
    { key: "m", text: "Male", value: "male" },
    { key: "f", text: "Female", value: "female" }
  ]
  return (
    <Field
      name="gender"
      options={genderOptions}
      selection
      placeholder="Select your gender"
      component={SelectComponent}
      {...props}
    />
  )
}

export default SelectGender
