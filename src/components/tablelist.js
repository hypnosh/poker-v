  import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {auth, db} from '../services/firebase';

class TableList extends Component {
  state = {
    loading: true,
    user: {
      email: "amitksharma@gmail.com"
    },
    tables: [

    ],
    formDisplay: false,
    formData: {
      tableName: "",
      blinds: "",
      players: [],
      pnl: "n"
    }
  }
  logout = () => {
    auth().signOut()
      .then(() => {
        // success
      })
      .catch((error) => {
        // error
        console.log("Sign out error", error);
      });
  }

  createTableAction = () => {
    this.setState({formDisplay: true});
  }

  createTable = async(event) => {
    // take inputs from the form and send to server to create a new table
    event.preventDefault();
    const [tableName, blinds, pnl] = [
      event.target.tableName.value,
      event.target.blinds.value,
      event.target.pnl.value
    ];
    const startingStack = event.target.blinds.value.split("/")[1] * 100;

    const playerEmails = [
      this.state.user.email,
      event.target.player2.value,
      event.target.player3.value,
      event.target.player4.value,
      event.target.player5.value,
      event.target.player6.value,
    ];
    // get first names from users table
    const firstNames = playerEmails.map((email, index) => {
      return db.collection("users").doc(email).get().then(doc => {
        return doc.exists ? doc.userName : email;
      });
    });
    const players = [
      { idx: 0, email: this.state.user.email, name: firstNames[0], stack: startingStack },
      { idx: 1, email: event.target.player2.value, name: firstNames[1], stack: startingStack },
      { idx: 2, email: event.target.player3.value, stack: startingStack },
      { idx: 3, email: event.target.player4.value, stack: startingStack },
      { idx: 4, email: event.target.player5.value, stack: startingStack },
      { idx: 5, email: event.target.player6.value, stack: startingStack },
    ];
    console.log({tableName, blinds, players, pnl});

    // create table in firestore
    db.collection("tables").add({
      tableName: tableName,
      blinds: blinds,
      players: players,
      playerEmails: playerEmails,
      pnl: pnl
    })
    .then((docRef) => {
      console.log("Table created", docRef);
      alert("Table created");
      this.setState({ formDisplay: false });
      db.collection("video").add({
        0: "videoOff",
        1: "videoOff",
        2: "videoOff",
        3: "videoOff",
        4: "videoOff",
        5: "videoOff",
      });
    })
    .catch((error) => {
      console.log("Table creation error", error);
    });
  }

  openTable = (id) => {
    // open the table which is clicked
    this.props.loadArena(id);
  }

  closeForm = () => {
    this.setState({formDisplay: false});
  }

  async componentDidMount() {
    auth().onAuthStateChanged((user) => {
      if (user) {
        const displayName = user.displayName;
        const nameArray = displayName.split(" ");
        const [firstName, lastName] = nameArray; // how to write it to the table?
        this.setState({
          authenticated: true,
          user: user.providerData[0],
          loading: false
        });
        // await db.collection("users").update()
      } else {
        this.setState({
          authenticated: false
        });
      }
    });
    let tables = [];
    await db.collection("tables")
      .where("playerEmails", "array-contains", this.state.user.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let blinds = doc.data().blinds;
          let blindsArr = blinds.split("/");
          let initStack = blindsArr[1] * 100;
          let table = {
            id: doc.id,
            tableName: doc.data().tableName,
            tablePlayers: doc.data().players.length,
            tableBlinds: blinds,
            tableStack: initStack,
          };
          tables.push(table);
        });
        this.setState({ tables: tables });
      })
      .catch(error => console.log("Error in getting docs ", error));
  }


  render() {
    document.title = "Poker Experiments";
    return (
      <div className="table-list-container">
        <h1 className="appname">Poker with Friends</h1><span className="email-on-tablelist">{this.state.user.email}</span>
        <h2 className={this.state.formDisplay ? " fade" : null }>{this.state.user.displayName}'s Tables</h2>
        <button className={`btn btn-main ${this.state.formDisplay ? " fade" : null }`} onClick={this.createTableAction}>Create Table</button>
        <button className="btn btn-sub" onClick={this.logout}>Logout</button>

        <div className={`table-list ${this.state.formDisplay ? " fade" : null }`}>
          <TableListItem
            type="header"
            tableName="Table"
            tablePlayers="#Plyrs"
            tableBlinds="Blinds"
            tableStack="Starting Stack"
            />
          {this.state.tables.map((table, index) => {
            return (<TableListItem
              type="item"
              key={table.id}
              id={table.id}
              tableName={table.tableName}
              tablePlayers={table.tablePlayers}
              tableBlinds={table.tableBlinds}
              tableStack={table.tableStack}
              openTable={this.openTable}
              />);
          })}
        </div>
        {(this.state.formDisplay) ? <CreateTableForm
          closeForm={this.closeForm}
          createTable={this.createTable}
          /> : null}
      </div>
    );
  }
}

const TableListItem = (props) => {
  /* id, title, seatsnumber, blinds, stack */
  const itemClass = "table-list-" + props.type;
  return(
    <Link to={props.id ? '/table/' + props.id : ''} className={itemClass} key={props.id}>
      <span className="table-name">{props.tableName}</span>
      <span className="table-players">{props.tablePlayers}</span>
      <span className="table-blinds">{props.tableBlinds}</span>
      <span className="table-stack">{props.tableStack}</span>
    </Link>
  );
}

const CreateTableForm = (props) => {

  const playersToInvite = [
    'player2',
    'player3',
    'player4',
    'player5',
    'player6'
  ];
  return (
    <form className="form-create-table" onSubmit={props.createTable}>
      <button className="closebtn" onClick={props.closeForm}>&times;</button>
      <h3>Create a Table</h3>

        <label className="label">Table Name</label><br/>
        <input
          type="text"
          className="fullw"
          name="tableName"
        />
      <br/>

        <label className="label">Blinds</label><br />
        <select name="blinds" className="fullw">
          <option value="1/2">1 / 2 (Opening Stack 200)</option>
          <option value="2/5">2 / 5 (Opening Stack 500)</option>
          <option value="5/10">5 / 10 (Opening Stack 1000)</option>
          <option value="10/20">10 / 20 (Opening Stack 2000)</option>
          <option value="25/50">25 / 50 (Opening Stack 5000)</option>
          <option value="50/100">50 / 100 (Opening Stack 10000)</option>
        </select>
      <br/>
      <label className="label">Invite your friends (up to 5)</label><br/>
      {
        playersToInvite.map((plyr, idx) => {
          return (<input type="text" name={plyr} className="playerToInvite" placeholder="Email" key={idx} />);
        })
      }
      <br clear="all" />
      <label className="label">Do you need a P&L account at the end of the game?</label><br/>
        <label className="label-radio"><input type="radio" name="pnl" value="Yes" /> Yes</label>
        <label className="label-radio"><input type="radio" name="pnl" checked value="No" /> No</label>
      <br/><br/>
      <button type="submit" className="btn btn-main">Create Table</button>
    </form>
  );
}

export default TableList;
