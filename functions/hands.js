const debug = true;

const rankToNum = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "T": 10,
  "J": 11,
  "Q": 12,
  "K": 13,
  "A": 14,
};

const straightflushEpoch  = 1200000,
      quadsEpoch          = 1100000,
      fullhouseEpoch      = 1000000,
      flushEpoch          =  700000,
      straightEpoch       =  600000,
      triadsEpoch         =  500000,
      twopairsEpoch       =  400000,
      pairEpoch           =  300000;


const compareHands = (playerHands, flop, turn, river) => {
  // playerHands is an array of arrays (consisting of hands of all players)
  let completeHands = playerHands.map((hand, index) => {
    return [...hand, ...flop, turn, river];
  });

  let handRanks = completeHands.map((hand, index) => {
    let cardRanks = hand.map((card, index) => {
      return rankToNum[card[0]];
    });
    let cardSuites = hand.map((card, index) => {
      return card[1];
    });
    let handObject = bestHand(cardRanks, cardSuites, index);
    return handObject.handValue;
  });

  return handValues;
}

const temp = (hand, index) => {
  let cardRanks = hand.map((card, index) => {
    return rankToNum[card[0]];
  });
  let cardSuites = hand.map((card, index) => {
    return card[1];
  });
  let handObject = bestHand(cardRanks, cardSuites, index);
  return handObject;
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

  var flush = isFlush(playerHandRanks, playerHandSuites);
  var rankHands = isRankHands(playerHandRanks);
  var straight = isStraight(playerHandRanks);
  let handValue = 0;
  // Straight & Royal Flush
  if (flush.flushSuite !== "none") {
    var straightFlush = isStraight(flush.flushRanks);
    if (straightFlush > 0) {
      // Royal & Straight Flush
      handValue = straightflushEpoch + straightFlush;
    } else {
      // only Flush
      handValue = flushEpoch + base13(flush.flushRanks) - 211629;
    }
  } // check for flushes

  if (handValue < straightflushEpoch && rankHands.quads !== undefined) {
    handValue = quadsEpoch + base13([rankHands.quads, rankHands.lones[0]], false) - 29;
  }
  if (handValue < straightEpoch && straight > 0) {
    handValue = straightEpoch + straight;
  }
  // console.log(handValue);

  // console.log(handValue);
  if (rankHands.triads !== undefined) {
    if (handValue < fullhouseEpoch && rankHands.pairs.length > 0) {
      // full house
      handValue = fullhouseEpoch + base13([rankHands.triads, rankHands.pairs[0]], false) - 29;
      // console.log(handValue);
    } else if (handValue < triadsEpoch){
      // only triad
      handValue = triadsEpoch + base13([rankHands.triads, rankHands.lones[0], rankHands.lones[1]], false) - 537;
      // console.log(handValue);
    }
  }
  if (handValue < twopairsEpoch && rankHands.pairs.length === 2) {
    // two pairs
    handValue = twopairsEpoch + base13([rankHands.pairs[0], rankHands.pairs[1], rankHands.lones[0]], false) - 537;
  } else if (handValue < pairEpoch && rankHands.pairs.length === 1) {
    // one pair
    handValue = pairEpoch + base13([rankHands.pairs[0], rankHands.lones[0], rankHands.lones[1], rankHands.lones[2]], false) - 5294;
    // console.log(handValue);
  } else if (handValue === 0) {
    // high card
    handValue = base13(playerHandRanks) - 211629;
    // console.log(handValue);
  }
  // console.log(handValue);

  var output = {
    player,
    flush,
    rankHands,
    straight,
    handValue
  };

  return output;

} // bestHand


const isRankHands = (playerHandRanks) => {
  var cardCount = [], specialCounts = {}, pairs = [], quads, triads, lones = [];
  playerHandRanks.forEach((card, i) => {
    cardCount[card] = (isNaN(cardCount[card]) ? 1 : cardCount[card] + 1);
  });
  // quads
  cardCount.forEach((count, i) => {
    if (count === 4) {
      quads = i;
    } else if (count === 3) {
      triads = i;
    } else if (count === 2) {
      pairs.push(i);
    } else if (count === 1) {
      lones.push(i);
    }
  });
  lones = lones.sort((a,b) => (b-a));
  pairs = pairs.sort((a,b) => (b-a));
  return {
    lones,
    pairs,
    triads,
    quads
  };
} // isRankHands
const isStraight = (playerHandRanks) => {
  var phr = [... new Set(playerHandRanks)];
  if (phr.some((a) => (a === 14))) { phr.push(1); } // if there is an A in the hand, then consider it as both 14 and 1
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
const isFlush = (playerHandRanks, playerHandSuites) => {
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
    flushRanks.sort((a, b) => b - a);

    // base 13 values
  }
  return ({
    flushSuite,
    flushRanks
  });
} // isFlush

const base13 = (ranks, sorting = true) => {
  // the function returns a unified integer value for the hand ranks.
  // Higher the number, better the rank.
  // Do not pass sequence of 5 or more, or pairs, triads, quads.
  // Deduplicate if there are pairs, triads, quads

  // sort descending if sorting == true, pick first 5 ranks
  // (or less if shorter array passed)

  ranks = (sorting ? ranks.sort((a, b) => (b - a)) : ranks).slice(0, 5);

  let modded = [];
  ranks.forEach((item, i) => {
    baseNot = Math.pow(13, (ranks.length-i-1)); // value of the position
    let itemRank = item * baseNot; // value of the card at this position
    modded[i] = itemRank;
  });
  let moddedSum = modded.reduce((sum, i) => sum + i); // final sum
  return moddedSum;
} // base13
