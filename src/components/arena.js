import React, { Component } from 'react';
import Table from './table';

const Arena = (props) => {
  return(
    <div className="arena">
      <div className="toolbar">
        <button className="goback" onClick={props.goback}>&#x2039;</button>
      </div>
      <Table id={props.id} />
    </div>
  );
}

export default Arena;
