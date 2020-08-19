import React, { Component } from 'react';
import Player from './player';
import Card from './card';

class Table extends Component {
  state = {
      button: 1,
      callButtonText: "Check",
      street: "flop",
      pot: 50000,
      players: [
        { idx: 1, name: "Amit", stack: 8000, bet: 800, hand: "AhKc" },
        { idx: 2, name: "Amit", stack: 8000, bet: 800 },
        { idx: 3, name: "Amit", stack: 8000, bet: 800 },
        { idx: 4, name: "Amit", stack: 8000, bet: 800 },
        { idx: 5, name: "Amit", stack: 8000, bet: 800 },
        { idx: 6, name: "Amit", stack: 8000, bet: 800 }
      ],
      playerAction: 3,
      flop: ["Ac", "Kc", "Qc"],
      turn: "Jc",
      river: "Tc"
  }

  foldAction = () => {
    // send fold action
  }
  callAction = () => {

  }
  raiseAction = () => {

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
            const playerHand = (player.Hand) ? player.Hand : "hide";
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
