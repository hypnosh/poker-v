import React, {Component} from 'react';

class App1 extends Component {
  state = {
    userName: "Amit"
  };

  modifyUserName = (event) => {
    this.setState({
      userName: event.target.value
    });
  }
    render() {
      return(
        <div>
          <UserInput userName={this.state.userName} change={this.modifyUserName.bind(this, )} />
          <UserOutput p1="testname" p2={this.state.userName} />
          <UserOutput p1="Hello World!" p2="Nice to meet you!" />
          <UserOutput p1="Hello World!" p2="Nice to meet you!" />
          <UserOutput p1="Hello World!" p2="Nice to meet you!" />
          <UserOutput p1="Hello World!" p2="Nice to meet you!" />
        </div>
      )
    }
}

const UserInput = (props) => {

    return (
      <input type="text" onChange={props.change} value={props.userName}/>
    );

}

const UserOutput = (props) => {

    return (
      <div>
        <p>{props.p1}</p>
        <p>{props.p2}</p>
      </div>
    );

}

export default App1;
