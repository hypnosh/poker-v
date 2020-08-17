import React, { Component } from 'react';
import Card from './card';

class Player extends Component {
  render() {
    return (
      <div className="player player-6">
  			<div className="player-name">{this.props.playerName}</div>
  			<div className="player-hand">
  				<Card type="shown" which="As" />
          <Card type="shown" which="Kd" />
          <Card type="hidden" />
  			</div>
  			<div className="player-stack">{this.props.playerStack}</div>
  			<div className="player-bet">{this.props.playerBet}</div>
  		</div>
    );
  }
}

export default Player;
