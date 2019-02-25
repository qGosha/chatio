import axios from "axios";
import {
  DELETE_USER,
  CHANGE_AVATAR,
  ERROR,
  CHANGE_AVATAR_START,
  CHANGE_SETTINGS,
  CHANGE_EMAIL_ON_CONFIRMATION,
  HIDE_SUCCESS_SETTINGS_UPDATE
} from "./types";
import history from "../helpers/history";
import {SubmissionError} from "redux-form";

export const deleteUser = () => async dispatch => {
  const res = await axios.get("/api/profile/deleteProfile");
  if (res.data.success) {
    dispatch({type: DELETE_USER});
    history.push("/");
  }
};

export const changeEmail = value => async dispatch => {
  try {
    const res = await axios.post("/api/profile/changeEmail", {...value});
    if (!res.data.success) {
      throw new Error(res.data.message);
    }
    dispatch({
      type: CHANGE_EMAIL_ON_CONFIRMATION,
      payload: res.data.message
    });
  } catch (e) {
    throw new SubmissionError({_error: e});
  }
};

export const changeAvatar = data => async dispatch => {
  dispatch({
    type: CHANGE_AVATAR_START
  });
  try {
    const res = await axios.post("/api/profile/changeAvatar", data);
    if (!res.data.success) {
      throw new Error(res.data.message);
    }
    dispatch({
      type: CHANGE_AVATAR,
      payload: res.data.message
    });
  } catch (e) {
    dispatch({
      payload: e,
      type: ERROR
    });
  }
};

export const changeSettings = values => async dispatch => {
  try {
    const res = await axios.post("/api/profile/changeSettings", {...values});
    if (!res.data.success) {
      throw Error(res.data.message);
    }
    dispatch({
      type: CHANGE_SETTINGS,
      payload: res.data.message
    });
    setTimeout(() => {
      dispatch({
        type: HIDE_SUCCESS_SETTINGS_UPDATE
      });
    }, 1500);
  } catch (e) {
    throw new SubmissionError({_error: e});
  }
};
