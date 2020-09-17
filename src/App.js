import React, { Component } from 'react';
import {
  Route,
  BrowserRouter,
  Switch,
  Redirect,
} from "react-router-dom";
import { PrivateRoute, PublicRoute } from './helpers/routing';
import Signup from './auth/signup';
import Login from './auth/login';

import TableList from './components/tablelist';
import Arena from './components/arena';
import './styles/main.css';
import {app, auth, db} from './services/firebase';


class App extends Component {
  state = {
    user: {},
    authenticated: false,
    screen: "tablelist",
  }
  loadTableList = () => {
    this.setState({screen: "tablelist"});
  }
  loadArena = (id) => {
    console.log(id);
    this.setState({
      screen: "arena",
      tableID: id
    });
  }
  componentDidMount = () => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          user: user.providerData[0]
        });
      } else {
        this.setState({
          authenticated: false
        });
      }
    });
  }
  render() {

    // let AppScreen;
    // switch(this.state.screen) {
    //   case "tablelist":
    //     AppScreen = (
    //       <TableList
    //         user={this.state.user}
    //         loadArena={this.loadArena.bind(this)}
    //       />
    //     );
    //   break;
    //   case "arena":
    //     AppScreen = (
    //       <Arena
    //         goback={this.loadTableList}
    //         tableID={this.state.tableID}
    //         user={this.state.user}
    //         />
    //     );
    //   break;
    //
    // }
    return (
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path="/" component={TableList} authenticated={this.state.authenticated} />
          <PrivateRoute path="/table/:id" component={Arena} authenticated={this.state.authenticated} />
          <PublicRoute path="/signup" component={Signup} authenticated={this.state.authenticated} />
          <PublicRoute path="/login" component={Login} authenticated={this.state.authenticated} />
        </Switch>
        {/* AppScreen */}
      </BrowserRouter>
    );
  }
}


export default App;
