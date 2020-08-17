import React, { Component } from 'react';
import './card.css';

class Card extends Component {
  processCard = () => {
    const card = this.props.which;
    const cardRank = card[0];
    const cardSuite = card[1];
    return 1;
    return (cardRank + " " + cardSuite);
  }

  render() {
    return(
      <span className="card">{this.processCard}</span>
    );
  }
}

export default Card;
