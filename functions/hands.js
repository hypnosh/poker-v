playerHands = [["5h", "As"], ["5d", "Ac"]];
flop = ["7c", "9h", "Kc"];
turn = "Jc";
river = "4c";

const compareHands = (playerHands, flop, turn, river) => {
  
  let completeHands = playerHands.map((hand, index) => {
    return [...hand, ...flop, turn, river];
  });


  let handRanks = completeHands.map((hand, index) => {
    let cardRanks = hand.map((card, index) => {
      return card[0];
    });
    let cardSuites = hand.map((card, index) => {
      return card[1];
    });
    let handObject = bestHand(cardRanks, cardSuites, index);
    return handObject.handRank;
  });

  return handRanks;
}

function bestHand(playerHandRanks, playerHandSuites, player) {
  // Sequence:
  // Check for flush, get top and bottom card in the top 5 of the suite
  //   If A & 10, then Royal Flush
  //   If diff is 4, then Straight Flush, mark top rank
  //   If neither, then Flush, mark all 5 ranks
  // Check for quads, mark the rank & final card
  // Check for full house, mark the two ranks
  // Check for straight, (deduplicate hands & sort by ranks, if diff between top 1 and top 5 is 4 then ok)
  // Check for triad, mark rank + remaining 2 top cards
  // Check for two pair, mark ranks + final highest card
  // Check for pair, mark rank + final 3 cards
  // Mark all 5 cards

  var quadsEpoch = 11,
      fullhouseEpoch = 168,
      flushEpoch = 335,
      straightEpoch = 1613,
      triadsEpoch = 1623,
      twopairEpoch = 1910,
      pairEpoch = 2197;

  var flush = isFlush(playerHandRanks, playerHandSuites);
  var rankHands = isRankHands(playerHandRanks);
  var straight = isStraight(playerHandRanks);
  var handRank;
  // Straight & Royal Flush
  if (flush.flushSuite !== "none") {
    var straightFlush = isStraight(flush.flushRanks);
    if (straightFlush === 14) {
      // Royal Flush
      handRank = 1;
    } else if (straightFlush > 0) {
      // Straight Flush
      handRank = 1 + 14 - straightFlush;
    } else {
      // only Flush
      handRank = flushEpoch;
    }
  } // check for flushes

  if (straight > 0) {
    handRank = straightEpoch;
  }

  if (rankHands.quads !== undefined) {
    handRank = quadsEpoch;
  }
  // if (straightFlush > 0) {
  //   // straight flush
  // } else if (rankHands.quads !== undefined) {
  //   // quads
  // } else if ((rankHands.triads !== undefined) and (rankHands.pairs !== undefined)) {
  //   // full house
  // } else if (flush.flushSuite !== "none") {
  //   // flush
  // } else if (straight > 0) {
  //   // straight
  // } else if (rankHands.triads !== undefined) {
  //   // trips
  // } else if (rankHands.pairs.length == 2) {
  //   // two pairs
  // } else if (rankHands.pairs.length == 1) {
  //   // one pair
  // }


  // the chain

  var output = [
    player,
    flush,
    rankHands,
    straight,
    handRank
  ];


  console.log({
    player,
    flush,
    rankHands,
    straight
  });
  return output;

} // bestHand


function isRankHands(playerHandRanks) {
  var cardCount = [], specialCounts = {}, pairs = [], quads, triads;
  for (var i = 2; i < 15; i++) {
    cardCount[i] = playerHandRanks.filter(rank => rank === i).length; // what am i trying to do here?
    if (cardCount[i] === 4) {
      // quads
      quads = i;
    } else if (cardCount[i] === 3) {
      // triads
      triads = i;
    } else if (cardCount[i] === 2) {
      pairs.push(i);
    }
  }
  specialCounts.pairs = pairs;
  specialCounts.triads = triads;
  specialCounts.quads = quads;
  return specialCounts;
} // isRankHands
function isStraight(playerHandRanks) {
  var phr = [... new Set(playerHandRanks)];
  if (phr.some((a) => (a === 14))) { phr.push(1); }
  phr.sort((a, b) => {return a - b});
  switch (true) {
    case (phr[6] - phr[2] === 4):
      return phr[6];
      // break;
    case (phr[5] - phr[1] === 4):
      return phr[5];
      // break;
    case (phr[4] - phr[0] === 4):
      return phr[4];
      // break;
    default:
      return 0;
  }
} // isStraight
function isFlush(playerHandRanks, playerHandSuites) {
  var s, d, c, h;
  var spadesCount = playerHandSuites.filter(suite => suite === "s").length;
  var diamsCount = playerHandSuites.filter(suite => suite === "d").length;
  var clubsCount = playerHandSuites.filter(suite => suite === "c").length;
  var heartsCount = playerHandSuites.filter(suite => suite === "h").length;
  let flushSuite;
  switch (true) {
    case (spadesCount > 4):
      flushSuite = "s";
      break;
    case (diamsCount > 4):
      flushSuite = "d";
      break;
    case (clubsCount > 4):
      flushSuite = "c";
      break;
    case (heartsCount > 4):
      flushSuite = "h";
      break;
    default:
      flushSuite = "none";
  }
  var flushRanks = [];
  if (flushSuite !== "none") {
    for (var i = 0; i < playerHandRanks.length; i++) {
      if (playerHandSuites[i] === flushSuite) {
        flushRanks.push(playerHandRanks[i]);
      }
    }
    flushRanks.sort((a, b) => a - b);
  }
  return ({
    flushSuite,
    flushRanks
  });
} // isFlush
