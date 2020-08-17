import React, { Component } from 'react';
import Player from './player';

class Table extends Component {
  state = {
      button: 1,
      callButtonText: "Call"
  }

  foldAction = () => {
    // send fold action 
  }
  callAction = () => {

  }
  raiseAction = () => {

  }

  render() {
    return (
      <div className="table">
        <div className="players">
          <Player playerName="Amit" playerStack="7000" playerBet="300" />
        </div>
        <div className="felt">
        </div>
        <div className="buttons">
          <button onClick="foldAction" className="action-button action-fold">Fold</button>
          <button onClick="callAction" className="action-button action-call">{this.state.callButtonText}</button>
          <button onClick="raiseAction" className="action-button action-raise">Raise</button>
        </div>
      </div>
    );
  }
}

export default Table;
