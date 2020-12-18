import React from 'react';
import Card from './card';

const Player = (props) => {
  const playerClass = "player playerseat-" + props.seat + " player-" + props.status;
  let cardType = "";
  let playerCard1 = "", playerCard2 = "";
  if (props.playerHand === "hide") {
    cardType = "hide";
  } else {
    cardType = "show";
    playerCard1 = props.playerHand[0] + props.playerHand[1];
    playerCard2 = props.playerHand[2] + props.playerHand[3];
  }

  return (
    <div className={playerClass}>
			<div className="player-name">{props.playerName}</div>
      {
        props.status !== "playing" ?
          <div className="player-hand"></div> :
        <div className="player-hand">
          <Card type={cardType} name={playerCard1} />
          <Card type={cardType} name={playerCard2} />
        </div>
      }
			<div className="player-stack">{props.playerStack}</div>
			<div className="player-bet">{props.playerBet}</div>
      {props.handStrength !== undefined ?
          <div className="hand-strength">{props.handStrength}, {props.potSplit}%</div>
        : null }
      <video
        index={props.playerNo}
        ref={props.setVideoRef}
        className="player-video"
        autoPlay={true}
        playsInline
        />
		</div>
  );
}

/* const EmptySeat = (props) => {
  return (
    <p>Come sit here</p>
  );
} */
export default Player;
