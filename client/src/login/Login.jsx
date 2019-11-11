import React from 'react';
import {Link, withRouter} from "react-router-dom";
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: '', update_string: 'just to annoy you'};
    }

    handleChange = (event) => {
        switch (event.target.name) {
            case "username":
                this.setState({update_string: "Welcome back " + event.target.value});
                break;
            case "password":
                this.setState({update_string:   "HAHA I know your password " + this.state.username
                                                + "!! its " + event.target.value})
        }
        this.setState({[event.target.name]: event.target.value});
    };

    handleSubmit = (event) => {
        // alert('A name was submitted: ' + this.state.username);
        event.preventDefault();
        this.props.history.push('/dashboard');
    };

    render(){
        return (
            <div align="center">
                <form onSubmit={this.handleSubmit}>
                    <h1>Hello to your favourite AutoScorer!</h1>
                    <b> Demo Login </b>
                    <p>Enter your username</p>
                    <input name='username' type="text" value={this.state.username}  onChange={this.handleChange}/>
                    <p>Password</p>
                    <input name='password' type="password" value={this.state.password}  onChange={this.handleChange}/>
                    <br/>
                    <input type="submit" value="Log in" />
                    <br/>
                    <Link to='/register'>Don't have an account? Sign Up</Link>
                </form>
                <p>AutoScorer feedback: {this.state.update_string}</p>
                <br/>
                {/*<Link to="/dashboard">Dashboard</Link>*/}
            </div>
        )
    }
}
export default withRouter(Login);
  