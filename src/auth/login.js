import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signin, signInWithGoogle } from '../helpers/auth';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  async handleSubmit(event) {
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
      let result = await signInWithGoogle();
      let user = result.user;
      console.log("Google signin");
      console.log(user);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  render() {
    return(
      <div className="auth-forms">
        <h1 className="appname">Poker with Friends</h1>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <h3>Login</h3>
          <input placeholder="Email" name="email" type="email" className="fullw"
            onChange={this.handleChange}
            value={this.state.email}
          />
          <br/>
          <input placeholder="Password" name="password" type="password" className="fullw"
            onChange={this.handleChange}
            value={this.state.password}
          />
          <br/>
          <p className="error">
            {this.state.error ? this.state.error: null}
          </p>
          <button
            type="submit"
            className="btn btn-main">Login</button> or <button
            onClick={this.googleSignIn}
            type="button"
            className="btn btn-secondary">
            Sign in with Google
          </button>
          <hr/>
          <p>Do not have an account? <Link
            className="btn" to="/signup">Sign Up</Link></p>
        </form>
      </div>
    );
  }
}

export default Login;
