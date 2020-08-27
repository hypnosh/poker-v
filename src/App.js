import React, { Component } from 'react';
import TableList from './components/tablelist';
import Arena from './components/arena';
import './components/main.css';


class App extends Component {
  state = {
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
