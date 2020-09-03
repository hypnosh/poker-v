import React, { Component } from 'react';
import Card from './card';

const Player = (props) => {
  const playerClass = "player player-" + props.playerNo + " player-" + props.status;
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
		</div>
  );
}

export default Player;
