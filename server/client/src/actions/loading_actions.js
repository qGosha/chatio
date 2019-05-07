import { SHOW_LOADING, HIDE_LOADING } from "./types"

export const showLoadingScreen = () => ({
  type: SHOW_LOADING
})

export const hideLoadingScreen = () => ({
  type: HIDE_LOADING
})
