import { Route, Redirect } from "react-router-dom"
import React from "react"

export const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (auth.isAuthenticated && auth.user.isConfirmed) {
        return <Component {...props} />
      }
      if (auth.isAuthenticated && !auth.user.isConfirmed) {
        return (
          <Redirect
            to={{
              pathname: "/confirmation",
              state: { from: props.location }
            }}
          />
        )
      } else {
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    }}
  />
)

export const EnterRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (auth.isAuthenticated && auth.user.isConfirmed) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard",
              state: { from: props.location }
            }}
          />
        )
      }
      if (auth.isAuthenticated && !auth.user.isConfirmed) {
        return (
          <Redirect
            to={{
              pathname: "/confirmation",
              state: { from: props.location }
            }}
          />
        )
      } else {
        return <Component {...props} />
      }
    }}
  />
)

export const ConfirmRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (auth.isAuthenticated && auth.user.isConfirmed) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard",
              state: { from: props.location }
            }}
          />
        )
      }
      if (!auth.isAuthenticated) {
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      } else {
        return <Component {...props} />
      }
    }}
  />
)
