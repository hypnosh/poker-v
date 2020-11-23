import React, { Component } from 'react';
import Player from './player';
import Card from './card';
import { app, auth, db, svrfunctions as fbfn } from '../services/firebase';
// import { createOffer, initiateConnection, startCall, sendAnswer, addCandidate, initiateLocalStream, listenToConnectionEvents } from '../helpers/RTCModule'
// import { doOffer, doAnswer, doLogin, doCandidate } from '../helpers/FirebaseModule';
import Peer from 'peerjs';
import '../styles/game.css';

const _sitIn = fbfn.httpsCallable('SitIn');
const _Bet = fbfn.httpsCallable('Bet');


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
      raiseFlag: false,
      user: {
        email: ''
      },
      email: ''
    }
    this.takeSeat = this.takeSeat.bind(this);
    this.callSize = this.callSize.bind(this);
    this.foldAction = this.foldAction.bind(this);
    this.callAction = this.callAction.bind(this);
    this.raiseAction = this.raiseAction.bind(this);

    this.connectToUser = this.connectToUser.bind(this);

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
    // auth.currentUser
    auth().onAuthStateChanged((user) => {
      if (user) {
        let me = this.state.players.filter(player => {
          return (player.email === user.providerData[0].email);
        })[0];
        const displayName = user.displayName;
        const nameArray = displayName.split(" ");
        const [firstName, lastName] = nameArray;
        this.setState({
          authenticated: true,
          user: user.providerData[0],
          email: user.providerData[0].email,
          me: me
        });
        let tableDocRef = db.collection("tables").doc(this.state.tableID);
        //let querySnapshot = await db.collection("tables").doc(this.state.tableID).get();
        tableDocRef.onSnapshot(snapshot => {
          let tableData = snapshot.data();
          const playersFromFB = tableData.players.map((player, index) => {
            player.idx = index+1;
            // console.log(player);
            return player;
          });
          let me = playersFromFB.filter(player => {
            return (player.email === this.state.user.email);
          })[0];
          this.setState({
            players: playersFromFB,
            me: me,
            playerID: me.idx
          });
          db.collection("video").doc(this.props.id).update({
            [this.state.playerID]: "videoOn"
          });
          // console.log("STATE ---");
          // console.log(tableData.players);
          // console.log(this.state.players);
          // console.log(playersFromFB);
          const mypeerID = this.state.playerID + "@" + this.state.tableID;
          const peer = new Peer(mypeerID);
          console.log("my peer ", mypeerID);
          this.setState({
            peer: peer
          });

          console.log ("Peer on");
          peer.on('open', (id) => {
            console.log({ on: "open" });
            console.log({ PeerID: id });
          });
          // if already sitting
          // console.log(this.state.me, this.state.me.position);
          console.log(this.state.players);
          console.log(this.state.email);
          let myPosition = this.state.me.position;
          if (myPosition) {
            console.log("Already sitting");
            this.loadLocalstream();
          }
          // set video doc entry for me
          // console.log({playerID: this.state.playerID});
          db.collection("video").doc(this.props.id).update({
            [this.state.playerID]: "videoOn"
          });
          // video doc onSnapshot
          db.collection("video").doc(this.props.id)
            .onSnapshot(doc => {
              let videoData = doc.data();
              if (typeof videoData === "array") {
                videoData.forEach(pair => {
                  console.log(pair);
                });
              } else if (typeof videoData === "object") {
                for (let key in videoData) {
                  if (videoData[key] === "videoOn") {
                    if (!(+key === this.state.playerID)) this.connectToUser(key);
                  }
                }
              }
            });
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




  } // componentDidMount

  setLocalVideoRef = ref => {
    this.localVideoRef = ref;
    // this.localVideoRef.muted = true;
  }

  setRemoteVideoRef = ref => {
    // console.log(ref);
    if (ref) {
      let playerID = (ref.getAttribute('index'));
      this.remoteVideoRef[playerID] = ref;
    }
  }


  addVideoStream = (peerID, stream, muted) => {
    // let video = document.querySelector("#" + peerID);
    let video;
    if (peerID === "me") {
      video = this.localVideoRef;
    } else {
      // identify other players' videos
      video = this.remoteVideoRef[peerID + "@" + this.state.tableID];
    }
    if (video) {
      video.srcObject = stream;
      if (muted === "mute") { video.muted = true; }
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
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
    // console.log(this.state.peer);
    console.log({connecttouser: peerID});
    console.log("connecting to peer ", peerID + "@" + this.state.tableID);
    let peer = this.state.peer;
    let thisCall = peer.call(peerID + "@" + this.state.tableID, this.state.localStream);
    console.log("thiscall");
    console.log(thisCall);
    if (thisCall !== undefined) {
      thisCall.on('stream', stream => {
        this.addVideoStream(peerID, stream);
      });
      thisCall.on('close', () => {
        // document.querySelector("#" + peerID).srcObject = null;
      });
    }
  }

  takeSeat = (event) => {
    // console.log("takeSeat");
    const position = event.target.dataset.position;
    _sitIn({
      tableID: this.state.tableID,
      email: this.state.user.email,
      name: this.state.user.displayName,
      position: position
    })
      .then(result => {
        // console.log("SitIn -----");
        // console.log(result);
        // console.log(result.data);
        // start video
        this.loadLocalstream();
      })
      .catch(error => {
        // console.log("SitIn error ----");
        console.error(error);
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
    _Bet({
      handID: this.state.handID,
      street: this.state.street,
      playerID: this.state.playerID,
      bet: 0,
      action: "fold"
    }).then(result => {
      console.log("betting result ", result);
    }).catch(error => {
      console.log(error);
    });
  }
  callAction = () => {
    // send check or call action - bet(0) or bet(call)
    this.setState({myBet: this.callSize()});
    let allIn = (this.callSize() >= me.stack);
    _Bet({
      handID: this.state.handID,
      street: this.state.street,
      playerID: this.state.playerID,
      bet: this.callSize(),
      action: "call",
      allIn: allIn
    }).then(result => {
      console.log("betting result ", result);
    }).catch(error => {
      console.log(error);
    });
  }
  raiseAction = () => {
    if (this.state.raiseFlag) {
      // read the raise amount and call the function - bet(raise)
      const myBet = this.state.myBet;
      let allIn = (myBet == me.stack);
      this.setState({raiseFlag: false});
      _Bet({
        handID: this.state.handID,
        street: this.state.street,
        playerID: this.state.playerID,
        bet: myBet,
        action: "raise",
        allIn: allIn
      }).then(result => {
        console.log("betting result ", result);
      }).catch(error => {
        console.log(error);
      });
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
    let callButtonText = (minBet === 0) ? "Check" : "Call (" + minBet + ")";
    let me = this.state.players.filter(player => {
      return (player.email === this.state.user.email);
      // return (player.idx === this.state.playerID);
    })[0];
    // console.log(me);
    // change window title to table details
    document.title = `Table # ${this.state.tableID} | ${this.state.blinds[0]}/${this.state.blinds[1]}` ;

    return (
      <div className="table">
        <div className="players">
          {this.state.players ? this.state.players.map((player, index) => {
            const playerHand = (player.hand) ? player.hand : "hide";
            if (player.position && player.status) {
              // figure out where to place each player on this client's screen
              let thisPosition = player.position;
              if (me && me.position) {
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
              if (me && !me.position) {
                return (
                  <div
                    key={player.idx}
                    className={`sit-here-button playerseat-` + player.idx}
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
          }) : null}
        </div>
        <span className={`dealer dealer-${this.state.button}`}>D</span>
        <div className="felt">
          {flop} {turn} {river}
        </div>
        <div className="pot">
          {this.state.pot}
        </div>
        {((this.state.playerID === this.state.playerAction)) ?
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
