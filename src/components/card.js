import React, { Component } from 'react';
import './card.css';

const Card = (props) => {
  if (props.name == "hide") {
    // other players' cards
    const cardClasses = "card pccard pccard-back";
    const cardDetails = (
      <span className={cardClasses}>
      </span>
    );
  } else {
    let crd = (props.name ? props.name : "Ah");
    // console.log(card);
    const suites = {
      h: ["hearts", "\u2665"],
      d: ["diams", "\u2666"],
      c: ["clubs", "\u2663"],
      s: ["spades", "\u2660"]
    };
    let cardRank = crd[0];
    let cardSuite = crd[1];
    const cardClasses = "card pccard pccard-" + suites[cardSuite][0];
    const cardDetails = (
      <span className={cardClasses}>
        <span className="pcrank">{cardRank}</span>
        <span className="pcsuite">{suites[cardSuite][1]}</span>
      </span>
    );
  }
  return({cardDetails});
}

export default Card;
