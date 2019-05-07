import axios from "axios"
import { LOGIN_USER, CONFIRM_USER } from "./types"
import history from "../helpers/history"
import { SubmissionError } from "redux-form"

export const signUpUser = values => async dispatch => {
  try {
    const res = await axios.post("/api/signup", values)
    const { data } = res
    if (data.success) {
      dispatch({ type: LOGIN_USER, payload: data.message })
      history.push("/confirmation")
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    throw new SubmissionError({ _error: err })
  }
}

export const confirmUser = values => async dispatch => {
  try {
    const res = await axios.post("/api/confirmation", values)
    const { data } = res
    if (data.success) {
      dispatch({ type: CONFIRM_USER, payload: data.message })
      history.push("/dashboard")
    } else {
      throw Error(data.message)
    }
  } catch (err) {
    throw new SubmissionError({ _error: err })
  }
}
