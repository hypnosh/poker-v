import React, { Component } from 'react';
import './card.css';

const Card = (props) => {
  if (props.type !== "hide") {
    let crd = props.name;
    console.log({card: crd, type: props.type});
    const suites = {
      h: ["hearts", "\u2665"],
      d: ["diams", "\u2666"],
      c: ["clubs", "\u2663"],
      s: ["spades", "\u2660"]
    };
    let cardRank = crd[0];
    let cardSuite = crd[1];
    const cardClasses = "card pccard pccard-" + suites[cardSuite][0];
    return(
      <span className={cardClasses}>
        <span className="pcrank">{cardRank}</span>
        <span className="pcsuite">{suites[cardSuite][1]}</span>
      </span>
    );
  } else {
    return(
      <span className="card pccard pccard-hide"></span>
    )
  }
}


export default Card;
