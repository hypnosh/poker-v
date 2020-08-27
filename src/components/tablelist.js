import React, { Component } from 'react';

class TableList extends Component {
  state = {
    email: "amitksharma@gmail.com",
    tables: [
      {
        id: 1,
        tableName: "IIM Indore",
        tablePlayers: 6,
        tableBlinds: "5/10",
        tableStack: "5000"
      }
    ],
    formDisplay: false
  }

  createTableAction = () => {
    this.setState({formDisplay: true})
  }
  createTable = () => {
    // take inputs from the form and send to server
  }

  openTable = (event) => {
    // open the table which is clicked

    const targetObject = (event.target.tagName == "LI") ? event.target : event.target.parentNode;
    this.props.loadArena(targetObject.id);
  }

  render() {
    document.title = "Poker Experiments";
    return (
      <div className="table-list-container">
        <h2>Your Tables</h2>
        <button className="btn btn-main" onClick={this.createTableAction}>Create Table</button>

        <ul className="table-list">
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
        </ul>
        {(this.state.formDisplay) ? <CreateTableForm /> : null}
      </div>
    );
  }
}

const TableListItem = (props) => {
  /* id, title, seatsnumber, blinds, stack */
  const itemClass = "table-list-" + props.type;
  return(
    <li className={itemClass} key={props.id} id={props.id} onClick={props.openTable}>
      <span className="table-name">{props.tableName}</span>
      <span className="table-players">{props.tablePlayers}</span>
      <span className="table-blinds">{props.tableBlinds}</span>
      <span className="table-stack">{props.tableStack}</span>
    </li>
  );
}

const CreateTableForm = (props) => {
  return (
    <form className="form-create-table">
      <button onClick={props.close}>&times;</button>
      <p>
        <label className="label">Table Name</label><br/>
        <input type="text" className="fullw" name="tableName" value={props.tableName} />
      </p>
      <p>
        <label className="label">Blinds</label><br />
        <select name="blinds" className="fullw">
          <option value="2">1 / 2 (Opening Stack 200)</option>
          <option value="2">2 / 5 (Opening Stack 500)</option>
          <option value="2">5 / 10 (Opening Stack 1000)</option>
          <option value="2">10 / 20 (Opening Stack 2000)</option>
          <option value="2">25 / 50 (Opening Stack 5000)</option>
          <option value="2">50 / 100 (Opening Stack 10000)</option>
        </select>
      </p>
      <p><label className="label">Invite your friends</label></p>
      <p><label className="label">Do you need a P&L account at the end of the game?</label><br/>
        <label class="label-radio"><input type="radio" name="pnl" value="Yes" /> Yes</label>
        <label class="label-radio"><input type="radio" name="pnl" value="No" /> No</label>
      </p>
      <p><button className="btn btn-main">Create Table</button></p>
    </form>
  );
}

export default TableList;
