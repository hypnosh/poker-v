const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.SitIn = functions.https.onCall((data, context) => {
  const tableID = data.tableID;
  const email = data.email;
  const position = data.position;
  const name = data.name;
  return db.collection("tables").doc(tableID).get()
    .then(doc => {
      if (!(doc && doc.exists)) {
        return "error: no such table";
      }
      const docData = {...doc.data()};
      const players = docData.players;
      const thisPlayerIndex = players.findIndex(player => (player.email === email));
      players[thisPlayerIndex].position = position;
      players[thisPlayerIndex].name = name;
      players[thisPlayerIndex].status = "playing";

      // check if two players are sitting
      var numPlaying = players.filter((player) => {
        return (player.position !== undefined && player.status === "playing");
      });

      if (numPlaying.length === 2) {
        // start the game
        // who is the button, sb, bb
        let buttonPos = numPlaying[0].idx;
        let smallBlind = numPlaying[1].idx;
        let bigBlind = numPlaying[0].idx;
        const betObjectInit = {
          "preflop": {
            0, 0, 0, 0, 0, 0
          },
          "flop": {
            0, 0, 0, 0, 0, 0
          },
          "turn": {
            0, 0, 0, 0, 0, 0
          },
          "river": {
            0, 0, 0, 0, 0, 0
          }
        }

        // deal
        dealCards(tableID, numPlaying).then(docRef => {
          db.collection("tables").doc(tableID).update({
            handID: docRef.id
          });
          // create a betting branch for this table
          db.collection("bets").doc(tableID).set(betObjectInit);
          return ([tableID, handID]);
        }).catch(error => error);
      }

      return db.collection("tables").doc(tableID).set(docData);
      // write to firebase
    });

}); // SitIn

const dealCards = async (tableID, numPlaying) => {
  // let arr = Array.from(Array(52).keys());
  // suitesSymbols = ['&spades;', '&diams;', '&clubs;', '&hearts;'],
  const cards = [],
      suites = ['s', 'd', 'c', 'h'],
      ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  for (var i = 0; i < 52; i++) {
    let rank = ranks[i % 13];
    let suite = suites[parseInt(i/13)];
    // let suiteSymbol = suitesSymbols[parseInt(i/13)];
    cards[i] = rank + suite;
  }
  // how many times I shuffle the deck, 2 to 7
  let numPasses = (Math.random() * 5 + 2) | 0;
  for (let i = 0; i < numPasses; i++) {
    // shuffle the deck
    cards.sort(() => Math.random() - 0.5);
  }

  let cardIndex = 0,
    playerCount = numPlaying.length;

  const playerHands = [], flop = [];
  // deal cards & store in hands branch
  numPlaying.forEach(plyr => {
    // take the first card from the deck, plus the first card after first pass
    let thisPlayerHand = {
      [numPlaying.idx]: [cards[cardIndex], cards[cardIndex + playerCount]]
    };
    playerHands.push(thisPlayerHand); // add to the array
    cardIndex++;
    cardIndex++; // because we're dealing both cards of each player at once
  });
  // burn 1
  cardIndex++;

  // flop
  flop.push(cards[cardIndex]);
  cardIndex++;
  flop.push(cards[cardIndex]);
  cardIndex++;
  flop.push(cards[cardIndex]);
  cardIndex++;
  // burn 1
  cardIndex++;

  // turn
  turn = cards[cardIndex];
  cardIndex++;
  // burn 1
  cardIndex++;

  // river
  river = cards[cardIndex];
  // will need to increment if we do run it twice some day

  return db.collection("hands").add({
    table: tableID,
    playerHands: playerHands,
    flop: flop,
    turn: turn,
    river: river,
  });
  // create a new hand doc. store the hand ID in table doc
}

exports.Bet = functions.https.onCall((data, context) => {
  const { tableID, handID, street, playerID, bet, action, allIn } = data;
  // update table with tableID for street , bet of playerID

  // update bet branch with existing data + new data
  db.collection("bets").doc(tableID).get()
    .then(snapshot => {
      const betObject = snapshot.data(); // get data from client
      const thisStreet = betObject[street];  // get the old bets in this street
      const oldBet = thisStreet[playerID]; // get the player's old bet in this street
      const newBet = oldBet + bet; // player's new bet

      thisStreet[playerID] = newBet; // set the new bet in the street
      betObject[street] = thisStreet; // set the main object
      // update table with new bet & action
      db.collection("tables").doc(tableID).get()
        .then(doc => {
          const docData = {...doc.data()};
          const players = docData.players;
          const thisPlayerIndex = players.findIndex(player => (player.idx === playerID));
          const potsize = docData.pot;
          const playerAction = docData.playerAction;
          const street = docData.street;

          players[thisPlayerIndex].bet = newBet;
          players[thisPlayerIndex].status = action;
          const playerStack = players[thisPlayerIndex].stack;

          const playerStatus = players[thisPlayerIndex].status;
          // PRATIK: pot calculation & stack updation
          potsize = potsize + bet;
          stack = stack - bet;

          // PRATIK: side pot
          // if (allIn) { create side pot }

          // move pointer to next player basis conditions (PRATIK)
          playerAction++; // 0 if 6
          // if all bets equal, then change street
          // condition will be thisStreet - every
          let condition = 1;
          if (condition) {
            switch(street) {
              case "preflop":
                street = "flop";
              break;
              case "flop":
                street = "turn";
              break;
              case "turn":
                street = "river";
              break;
              case "river":
              // compare hands and show
              // arguments - handID, returns - object with player ranking

              break;
            }
          }
          docData.street = street;
          docData.pot = potsize;
          docData.players[thisPlayerIndex].stack = stack;
          docData.playerAction = playerAction;
          docData.status = (allIn ? "All in" : (action ==  "fold" : "fold" ? playerStatus));

          // write potsize, player's stack, street, playerAction
          return db.collection("tables").doc(tableID).update(docData);
        });
      // write to db
      return db.collection("bets").doc(tableID).update(betObject);
    }).catch(error => error);
}); // Bet



exports.DummyDeal = functions.https.onRequest((req, res) => {
  // just to test if dealCards() is working fine.
  // will remove in production.

  let plyrs = JSON.parse("[{\"idx\":0,\"name\":\"A\"},{\"idx\":1,\"name\":\"A\"},{\"idx\":2,\"name\":\"A\"},{\"idx\":3,\"name\":\"A\"}]"),
  tableID = "2zLwrEyJWbOg1MIpmVUJ";

  dealCards(tableID, plyrs).then(docRef => {
    console.log("cards dealt ", docRef.id);
    db.collection("tables").doc(tableID).update({
      handID: docRef.id
    });
    return docRef.id;
  }).catch(error => {
    console.log("error in dealing ", error);
    return error;
  });
  //   throw (error);
  // });
}); // DummyDeal
