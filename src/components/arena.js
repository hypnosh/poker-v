import React, { Component } from 'react';
import Table from './table';
import { Link } from 'react-router-dom';

const Arena = (props) => {
  return(
    <div className="arena">
      <header className="toolbar">
      	<nav>
          {/* <Link className="goback" to={tableList}>&#x2039;</Link> */}
      		<Link to="/" className="goback">&#x2039;</Link>
      	</nav>
      </header>
      <Table id={props.match.params.id} history={props.history} />
    </div>
  );
}

export default Arena;
