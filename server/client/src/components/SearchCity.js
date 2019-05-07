import React from "react"
import debounce from "lodash.debounce"
import axios from "axios"
import { SearchComponent } from "../helpers/common"
import { Field } from "redux-form"

const SearchCity = ({ change, setResults, results, ...other }) => {
  const searchCity = async value => {
    const res = await axios.post("/api/search/city", { value })
    const { data } = res
    if (data.success && data.results.length > 0) {
      const results = data.results.map(i => {
        i = {
          ...i,
          key: i.id,
          title: i.description,
          description: ""
        }
        return i
      })
      setResults(results)
    }
  }
  const onDebouncedInput = debounce(searchCity, 300, { leading: true })
  const handleSearchChange = value => {
    if (!value) {
      setResults([])
      return
    }
    onDebouncedInput(value)
  }
  return (
    <Field
      handleSelectResult={change}
      handleSearchChange={handleSearchChange}
      fluid
      name="city"
      results={results}
      placeholder="Type your city name"
      component={SearchComponent}
      {...other}
    />
  )
}

export default SearchCity
