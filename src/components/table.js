import React, { Component } from 'react';
import Player from './player';
import Card from './card';

class Table extends Component {
  state = {
      tableID: this.props.id,
      playerID: 1,
      blinds: [5, 10],
      button: 1,
      callButtonText: "Check",
      street: "river",
      pot: 50000,
      players: [
        { idx: 1, name: "Amit", stack: 8000, bet: 80, hand: "AhKc", handStrength: "Straight A-T", potSplit: 100 },
        { idx: 2, name: "Pratik", stack: 8000, bet: 90 },
        { idx: 3, name: "Saumitra", stack: 8000, bet: 70 },
        { idx: 4, name: "Saurabh", stack: 8000, bet: 100 },
        { idx: 5, name: "Premi", stack: 8000, bet: 120 },
        { idx: 6, name: "Manish", stack: 8000, bet: 60 }
      ],
      playerAction: 1,
      flop: ["3h", "7s", "Qc"],
      turn: "Jd",
      river: "Td",
      raiseFlag: false,
  }

  callSize = () => {
    // figure out what the minimum bet or call size can be
    let players = [... this.state.players];
    let highestBidder = players.reduce((prev, current) => {
      return (prev.bet > current.bet) ? prev: current;
    });
    return highestBidder.bet;
  }
  foldAction = () => {
    // send fold action - fold()
  }
  callAction = () => {
    // send check or call action - bet(0) or bet(call)
    this.setState({myBet: this.callSize()});
  }
  raiseAction = () => {
    if (this.state.raiseFlag) {
      // read the raise amount and call the function - bet(raise)
      const myBet = this.state.myBet;

      this.setState({raiseFlag: false});

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

    // figure out bet size

    let minBet = this.callSize();
    let callButtonText = (minBet == 0) ? "Check" : "Call (" + minBet + ")";
    let me = this.state.players.filter(player => {
      return (player.idx == this.state.playerID);
    });

    // change window title to table details
    document.title = `Table # ${this.state.tableID} | ${this.state.blinds[0]}/${this.state.blinds[1]}` ;

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
                handStrength={player.handStrength}
                potSplit={player.potSplit}
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
            <button onClick={this.foldAction} className="btn action-button action-fold">Fold</button>
            <button onClick={this.callAction} className="btn action-button action-call">{callButtonText}</button>
            <button onClick={this.raiseAction} className="btn action-button action-raise">Raise {this.state.myBet}</button>
            {(this.state.raiseFlag) ?
              <span className="raising-slider">
                <input
                  type="range"
                  className="slider"
                  min={minBet + this.state.blinds[0]}
                  max={me[0].stack}
                  step={this.state.blinds[0]}
                  value={this.state.myBet ? this.state.myBet : minBet + this.state.blinds[0]}
                  onChange={(event) => {
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
