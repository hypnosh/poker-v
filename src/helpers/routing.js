import React, { Component } from 'react';
import {
  Route,
  BrowserRouter,
  Switch,
  Redirect,
} from "react-router-dom";

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}

const PublicRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === false
        ? <Component {...props} />
        : <Redirect to='/' />}
    />
  )
}

export { PrivateRoute, PublicRoute };
