import React, { Component } from 'react';
import Player from './player';
import Card from './card';
import { app, auth, db, svrfunctions as fbfn } from '../services/firebase';
import '../styles/game.css';
const sitIn = fbfn.httpsCallable('SitIn');

class Table extends Component {
  state = {
    authenticated: false,
    tableID: this.props.id,
    playerID: 2, /* this.props.user */
    handID: 0,
    blinds: [],
    button: 5,
    callButtonText: "Check",
    street: "turn",
    pot: 50000,
    players: [
      {
        idx: 1, name: "Amit", email: "amitksharma@gmail.com", stack: 8000, bet: 80,
        position: 1, status: "playing",
        hand: "AhKc", handStrength: "Straight A-T", potSplit: 100
      },
      {
        idx: 2, name: "Pratik", email: "pratad@gmail.com", stack: 8000, bet: 90,
        position: 3, status: "playing"
      },
      {
        idx: 3, name: "Saumitra", stack: 8000, bet: 70,
        status: "sittingout",

      },
      {
        idx: 4, name: "Saurabh", stack: 8000, bet: 100,
        status: "playing",

      },
      {
        idx: 5, name: "Premi", stack: 8000, bet: 120,


      },
      {
        idx: 6, name: "Manish", stack: 8000, bet: 60,

      }
    ],
    playerAction: 1,
    flop: ["3h", "7s", "Qc"],
    turn: "Jd",
    river: "Td",
    raiseFlag: false,
  }
  async componentDidMount() {
    // get user's details
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
        this.props.history.replace('/login');
      }
    });
    // get table details - ID from props
    // get hand details - ID from table record - listen
    // get bids - listen
    // console.log(this.state.tableID);
    await db.collection("tables").doc(this.state.tableID)
      .get()
      .then(querySnapshot => {
        let tableData = querySnapshot.data();
        console.log(tableData);
      })
      .catch(error => console.log("Error in getting table ", error));
  }

  takeSeat = (event) => {
    const position = event.target.dataset.position;
    sitIn({
      tableID: this.state.tableID,
      email: this.state.user.email,
      position: position
    })
      .then(result => {
        console.log("SitIn -----");
        console.log(result);
        console.log(result.data);
      })
      .catch(error => {
        console.log("SitIn error ----");
        console.log(error);
      });
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
    })[0];

    // change window title to table details
    document.title = `Table # ${this.state.tableID} | ${this.state.blinds[0]}/${this.state.blinds[1]}` ;

    return (
      <div className="table">
        <div className="players">
          {this.state.players.map((player, index) => {
            const playerHand = (player.hand) ? player.hand : "hide";
            if (player.position && player.status) {
              let thisPosition = player.position;
              if (me.position) {
                thisPosition = player.position - me.position + 1;
                thisPosition = (thisPosition < 1) ? thisPosition + 6 : thisPosition;
                console.log({player: player.name, thisPosition: thisPosition, playerPosition: player.position, mePosition: me.position});
                console.log("ss");
              }
              return(
                <Player
                  key={player.idx}
                  playerNo={player.idx}
                  playerName={player.name}
                  playerStack={player.stack}
                  playerBet={player.bet}
                  playerHand={playerHand}
                  seat={thisPosition}
                  handStrength={player.handStrength}
                  potSplit={player.potSplit}
                  status={player.status}
                />);
            } else {
              if (!me.position) {
                return (
                  <div
                    key={player.idx}
                    className={`sit-here-button player-` + player.idx}
                    >
                    <button
                      onClick={this.takeSeat}
                      data-position={player.idx}>
                      Sit here
                    </button>
                  </div>
                );
              }
            }
            })}
        </div>
        <span className={`dealer dealer-${this.state.button}`}>D</span>
        <div className="felt">
          {flop} {turn} {river}
        </div>
        <div className="pot">
          {this.state.pot}
        </div>
        {((this.state.playerID == this.state.playerAction)) ?
          <div className="buttons">
            <button onClick={this.foldAction}
              className="btn action-button action-fold">Fold</button>
            <button onClick={this.callAction}
              className="btn action-button action-call">{callButtonText}</button>
            <button onClick={this.raiseAction}
              className="btn action-button action-raise">Raise {this.state.myBet}</button>
            {(this.state.raiseFlag) ?
              <span className="raising-slider">
                <input
                  type="range"
                  className="slider"
                  min={minBet + this.state.blinds[0]}
                  max={me.stack}
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
