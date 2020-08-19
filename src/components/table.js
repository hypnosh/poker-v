import React, { Component } from 'react';
import Player from './player';
import Card from './card';

class Table extends Component {
  state = {
      playerID: 1,
      blinds: [5, 10],
      button: 1,
      callButtonText: "Check",
      street: "flop",
      pot: 50000,
      players: [
        { idx: 1, name: "Amit", stack: 8000, bet: 800, hand: "AhKc" },
        { idx: 2, name: "Pratik", stack: 8000, bet: 800 },
        { idx: 3, name: "Saumitra", stack: 8000, bet: 800 },
        { idx: 4, name: "Saurabh", stack: 8000, bet: 800 },
        { idx: 5, name: "Premi", stack: 8000, bet: 800 },
        { idx: 6, name: "Manish", stack: 8000, bet: 800 }
      ],
      playerAction: 1,
      flop: ["Ac", "Kc", "Qc"],
      turn: "Jc",
      river: "Tc",
      raiseFlag: false,
      myBet: 0
  }

  foldAction = () => {
    // send fold action
  }
  callAction = () => {

  }
  raiseAction = () => {
    if (this.state.raiseFlag) {
      // read the raise amount and call the function
      const myBet = this.state.myBet;
    } else {
      this.setState({raiseFlag: true});
    }
  }

  render() {
    let flop = (
      <span className="flop">
        {this.state.flop.map((card, index) => {
          return(
            <Card type="shown" name={card} key={index} />
          );
        })}
      </span>
    );
    let turn = (
      <span className="turn">
        <Card type="shown" name={this.state.turn} />
      </span>
    );
    let river = (
      <span className="river">
        <Card type="shown" name={this.state.river} />
      </span>
    );
    switch (this.state.street) {
      case "flop":
        turn = "";
        river = "";
        break;
      case "turn":
        river = "";
        break;
      case "river":
        break;
      default:
    }

    return (
      <div className="table">
        <div className="players">
          {this.state.players.map((player, index) => {
            const playerHand = (player.hand) ? player.hand : "hide";
            return(
              <Player
                key={player.idx}
                playerNo={player.idx}
                playerName={player.name}
                playerStack={player.stack}
                playerBet={player.bet}
                playerHand={playerHand}
              />);
            })}
        </div>
        <div className="felt">
          {flop} {turn} {river}
        </div>
        <div className="pot">
          {this.state.pot}
        </div>
        {(this.state.playerID == this.state.playerAction) ?
          <div className="buttons">
            <button onClick={this.foldAction} className="action-button action-fold">Fold</button>
            <button onClick={this.callAction} className="action-button action-call">{this.state.callButtonText}</button>
            <button onClick={this.raiseAction} className="action-button action-raise">Raise {this.state.myBet}</button>
            {(this.state.raiseFlag) ?
              <span className="raising-slider">
                <input type="range" min="0" max="100" class="slider" onChange={(event) => {
                  this.setState({myBet: event.target.value});
                }} />
              </span>
              : null}
          </div>
          : null }
      </div>
    );
  }
}

export default Table;
