
export const doLogin = async (table, collection, handleVideoUpdate, username) => {
  // await database.collection('video').doc(table).remove()
  console.log("doLogin: ", table);
  collection.doc(table).get()
    .then(snapShot => {
      if (!snapShot.exists) {
        collection.doc(table).set({
          [username]: "a"
        });
      }
    });
  collection.doc(table).onSnapshot(snapshot => {
    handleVideoUpdate(snapshot.data(), table);
  });
}

export const doOffer = async (table, offer, collection, username) => {
  console.log("doOffer: ", table, username);
  await collection.doc(table).update({
    [username]: {
      from: username,
      type: "offer",
      offer: JSON.stringify(offer)
    }
  });
  alert("offer created");
  // await database.ref('/video/' + table).set({
  //   type: 'offer',
  //   from: username,
  //   offer: JSON.stringify(offer)
  // })
}

export const doAnswer = async (table, answer, collection, username) => {
  console.log("doAnswer: ", table, username);
  await collection.doc(table).update({
    [username]: {
      from: username,
      type: 'answer',
      answer: JSON.stringify(answer)
    }
  });
  // await database.ref('/video/' + table).update({
  //   type: 'answer',
  //   from: username,
  //   answer: JSON.stringify(answer)
  // })
}

export const doLeaveNotif = async (table, database, username) => {
  await database.ref('/video/' + table).update({
    type: 'leave',
    from: username
  })
}

export const doCandidate = async (table, candidate, collection, username) => {
  // send the new candiate to the peer
  console.log("doCandidate: ", table, username);
  await collection.doc(table).update({
    [username]: {
      from: username,
      type: 'candidate',
      answer: JSON.stringify(candidate)
    }
  });
  // await database.ref('/video/' + table).update({
  //   type: 'candidate',
  //   from: username,
  //   candidate: JSON.stringify(candidate)
  // })
}
