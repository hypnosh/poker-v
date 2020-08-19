import React, { Component } from 'react';
import Card from './card';

const Player = (props) => {
  const playerClass = "player player-" + props.playerNo;
  const playerCard1 = props.playerHand[0] + props.playerHand[1];
  const playerCard2 = props.playerHand[2] + props.playerHand[3];

  return (
    <div className={playerClass}>
			<div className="player-name">{props.playerName}</div>
			<div className="player-hand">
				<Card type="shown" name={playerCard1} />
        <Card type="shown" name={playerCard2} />
			</div>
			<div className="player-stack">{props.playerStack}</div>
			<div className="player-bet">{props.playerBet}</div>
		</div>
  );
}

export default Player;
