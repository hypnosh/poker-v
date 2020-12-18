import React from 'react';
import '../styles/card.css';

const Card = (props) => {
  if (props.type !== "hide") {
    let crd = props.name;

    const suites = {
      h: ["hearts", "\u2665"],
      d: ["diams", "\u2666"],
      c: ["clubs", "\u2663"],
      s: ["spades", "\u2660"]
    };
    const [cardRank, cardSuite] = crd;
    // let cardRank = crd[0];
    // let cardSuite = crd[1];
    const cardClasses = "card pccard-" + suites[cardSuite][0];
    return(
      <span className={cardClasses}>
        <span className="pcrank">{cardRank}</span>
        <span className="pcsuite">{suites[cardSuite][1]}</span>
        <span className="pcsuite-large">{suites[cardSuite][1]}</span>
      </span>
    );
  } else {
    return(
      <span className="card pccard-hide"></span>
    )
  }
}


export default Card;
