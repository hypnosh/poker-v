import React, { Component } from 'react';
import Player from './player';
import Card from './card';
import { app, auth, db, svrfunctions as fbfn } from '../services/firebase';
// import { createOffer, initiateConnection, startCall, sendAnswer, addCandidate, initiateLocalStream, listenToConnectionEvents } from '../helpers/RTCModule'
// import { doOffer, doAnswer, doLogin, doCandidate } from '../helpers/FirebaseModule';
import Peer from 'peerjs';
import '../styles/game.css';

const sitIn = fbfn.httpsCallable('SitIn');

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      tableID: this.props.id,
      playerID: 1, /* this.props.user */
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
    this.takeSeat = this.takeSeat.bind(this);
    this.callSize = this.callSize.bind(this);
    this.foldAction = this.foldAction.bind(this);
    this.callAction = this.callAction.bind(this);
    this.raiseAction = this.raiseAction.bind(this);

    this.localVideoRef = React.createRef();
    this.remoteVideoRef = [];
    for(let i=1; i<6; i++) {
      this.remoteVideoRef[i] = React.createRef;
    }
    // this.remoteVideoRef = React.createRef();
  }
  constraints = {
    video: { facingMode: "user" },
    audio: true
  };
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
    try {
      let querySnapshot = await db.collection("tables").doc(this.state.tableID).get();
      let tableData = querySnapshot.data();
      console.log(tableData);
    } catch(error) {
      console.log("Error in getting table ", error);
    }
    const mypeerID = this.state.playerID + "@" + this.state.tableID;
    const peer = new Peer(mypeerID);
    this.setState({
      peer: peer
    });
    peer.on('open', (id) => {
      console.log({ on: "open" });
      console.log({ PeerID: id });
    });
    this.loadLocalstream();
    // const localStream = await initiateLocalStream();
    // this.localVideoRef.srcObject = localStream;

    // const localConnection = await initiateConnection();

    // this.setState({
    //   localStream,
    //   localConnection
    // });
    // await doLogin(this.props.id, db.collection('video'), this.handleVideoUpdate, username);
  } // componentDidMount

  setLocalVideoRef = ref => {
    this.localVideoRef = ref;
    this.localVideoRef.muted = true;
  }

  setRemoteVideoRef = ref => {
    // console.log(ref);
    let playerID = (ref.getAttribute('index'));
    this.remoteVideoRef[playerID] = ref;
  }
  

  addVideoStream = (peerID, stream, muted) => {
    // let video = document.querySelector("#" + peerID);
    let video;
    if (peerID == "me") {
      video = this.localVideoRef;
    } else {
      // करते हैें कुछ
    }
    
    video.srcObject = stream;
    if (muted == "mute") { video.muted = true; }
    video.addEventListener('loadedmetadata', () => {
      video.play();
    })
  }
  loadLocalstream = async (myID) => {
    if (navigator.mediaDevices.getUserMedia) {
      // console.log('mycam');
      const localStream = await this.mediaStream(this.constraints);
      this.addVideoStream("me", localStream, "mute");
      let myVideo = document.querySelector("#" + myID + "-container");
      // myVideo.classList.add('myVideo');
      // myVideo.classList.remove('video-container');

      this.state.peer.on('call', call => {
        console.log({ on: "call" });

        call.answer(localStream);
        call.on('stream', stream => {
          console.log({ on: "stream, inside call" });
          this.addVideoStream(call.peer, stream);
        });
      });
      this.setState({
        localStream: localStream
      });
      // checkVideo();

    }
  }
  mediaStream = async (constraints) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (error) {
      console.log({ mediaStreamError: error });
      return false;
    }
  }
  connectToUser = (peerID) => {
    const thisCall = this.state.peer.call(peerID, window.localStream);
    thisCall.on('stream', stream => {
      this.addVideoStream(peerID, stream);
    });
    thisCall.on('close', () => {
      // document.querySelector("#" + peerID).srcObject = null;
    });
  }
  // myStartCall = async (username, userToCall) => {
  //   console.log("myStartCall", username, userToCall);
  //   const { localConnection, database, localStream } = this.state
  //   listenToConnectionEvents(localConnection, username, userToCall, database, this.remoteVideoRef, doCandidate)
  //   // create an offer
  //   createOffer(localConnection, localStream, userToCall, doOffer, database, username)
  // }

  // handleVideoUpdate = (snapshotData, username) => {
  //   console.log("handleUpdate", username);
  //   console.log(snapshotData);
  //   const { localConnection, localStream } = this.state;

  //   if (snapshotData) {
  //     snapshotData.forEach(entry => {
  //       if (entry) {
  //         switch (entry.type) {
  //           case 'offer':
  //             // this.setState({
  //             //   connectedUser: entry.from
  //             // });

  //             listenToConnectionEvents(localConnection, username, entry.from, db.collection('video'), this.remoteVideoRef, doCandidate);

  //             sendAnswer(localConnection, localStream, entry, doAnswer, db.collection('video'), username);
  //           break;
  //           case 'answer':

  //             this.setState({
  //               connectedUser: entry.from
  //             });
  //             startCall(localConnection, entry);
  //           break;
  //           case 'candidate':
  //             addCandidate(localConnection, entry);
  //           break;
  //           default:
  //           break
  //         }
  //       }
  //     });

  //   }
  // }

  takeSeat = (event) => {
    console.log("takeSeat");
    const position = event.target.dataset.position;
    if (navigator.mediaDevices.getUserMedia) {
	    navigator.mediaDevices.getUserMedia({
	      video: true,
	      audio: true
	    }).then(function(stream) {
	      this.setState({

        });
	    }).catch(function(error) {
	      console.log("Error", error);
	    });
	  }
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
              // figure out where to place each player on this client's screen
              let thisPosition = player.position;
              if (me.position) {
                thisPosition = player.position - me.position + 1;
                thisPosition = (thisPosition < 1) ? thisPosition + 6 : thisPosition;
                // console.log({player: player.name, thisPosition: thisPosition, playerPosition: player.position, mePosition: me.position});
                // console.log("ss");
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
                  setVideoRef={ thisPosition === 1 ? this.setLocalVideoRef : this.setRemoteVideoRef }
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
