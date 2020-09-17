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

      return db.collection("tables").doc(tableID).set(data);
      // write to firebase
    });
}); // SitIn
