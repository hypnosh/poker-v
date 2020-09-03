import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signin, signInWithGoogle } from '../helpers/auth';

class Login extends Component {
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
      await signin(this.state.email, this.state.password);
    } catch(error) {
      this.setState({ error: error.message });
    }
  }
  async googleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  return(
    <form autoComplete="off" onSubmit={this.handleSubmit}>
      <h3>Login</h3>
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
      <button type="submit" className="btn btn-main">Login</button>
      <p>Or</p>
      <button onClick={this.googleSignIn} type="button">
        Sign up with Google
      </button>
      <hr/>
      <p>Do not have an account? <Link to="/signup">Sign Up</Link></p>"
    </form>
  );
}
