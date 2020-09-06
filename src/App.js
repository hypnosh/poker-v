import React, { Component } from 'react';
import {
  Route,
  BrowserRouter,
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
            tableID={this.state.tableID}
            user={this.state.user}
            />
        );
      break;

    }
    return (
      <BrowserRouter>
        <Route exact path="/" component={TableList} />
        <Route path="/table" component={Arena} />
        {/* AppScreen */}
      </BrowserRouter>
    );
  }
}


export default App;
