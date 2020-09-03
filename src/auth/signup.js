import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../helpers/auth';

class Signup extends Component {
  state = {
    error: null,
    email: '',
    password: ''
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  async handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      await signup(this.state.email, this.state.password);
    } catch(error) {
      this.setState({ error: error.message });
    }
  }
  return(
    <form onSubmit={this.handleSubmit}>
      <h3>Sign up</h3>
      <input placeholder="Email" name="email" type="email"
        onChange={this.handleChange}
        value={this.state.email}
      /><br/>
      <input placeholder="Password" name="password" type="password"
        onChange={this.handleChange}
        value={this.state.password}
      /><br/>
      <p className="error">
        {this.state.error ? this.state.error: null}
      </p>
      <button type="submit" className="btn btn-main">Sign Up</button>
      <hr/>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
