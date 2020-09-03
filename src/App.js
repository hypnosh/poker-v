import React, { Component } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import TableList from './components/tablelist';
import Arena from './components/arena';
import './components/main.css';
import {app, auth, db} from './services/firebase';


class App extends Component {
  state = {
    user: auth().currentUser,
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
  render() {
    let AppScreen;
    switch(this.state.screen) {
      case "tablelist":
        AppScreen = (
          <TableList
            user={this.state.user}
            loadArena={this.loadArena.bind(this)}
          />
        );
      break;
      case "arena":
        AppScreen = (
          <Arena
            goback={this.loadTableList}
            id={this.state.tableID}
            />
        );
      break;

    }
    return (<div>{AppScreen}</div>);
  }
}


export default App;
