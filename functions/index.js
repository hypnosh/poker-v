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
  return db.collection("tables").doc(tableID).get()
    .then(doc => {
      if (!(doc && doc.exists)) {
        return "error: no such table";
      }
      const data = {...doc.data()};
      const players = data.players;
      const thisPlayerIndex = players.findIndex(player => {
        return player.email === email;
      });
      players[thisPlayerIndex].position = position;
      players[thisPlayerIndex].status = "playing";

      // check if two players are sitting
      var numPlaying = players.filter((player) => {
        return (player.position !== undefined && player.status == "playing");
      });

      if (numPlaying.length == 2) {
        // start the game
        // who is the button, sb, bb
        let buttonPos = numPlaying[0].idx;
        let smallBlind = numPlaying[1].idx;
        let bigBlind = numPlaying[0].idx;
        // deal
        dealCards(tableID);

      }

      return db.collection("tables").doc(tableID).set(data);
      // write to firebase
    });

}); // SitIn

const dealCards = (tableID) => {
  // deal cards & store in hands branch
  // create a new hand doc. store the hand ID in table doc
}

exports.Bet = functions.https.onCall((data, context) => {
  { tableID, street, playerID, bet } = data;
  // update table with tableID for street , bet of playerID

}