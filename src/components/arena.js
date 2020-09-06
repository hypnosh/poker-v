import React, { Component } from 'react';
import Table from './table';

const Arena = (props) => {
  return(
    <div className="arena">
      <header className="toolbar">
      	<nav>
      		<button className="goback" onClick={props.goback}>&#x2039;</button>
      	</nav>
      </header>
      <Table id={props.tableID} />
    </div>
  );
}

export default Arena;
