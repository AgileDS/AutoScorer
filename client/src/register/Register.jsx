import {Link, withRouter} from "react-router-dom";
import React from "react";


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            confirm_password: ''
        };
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleSubmit = (event) => {
        // alert('A name was submitted: ' + this.state.username);
        event.preventDefault();
        this.props.history.push('/');
    };

    render(){
        return (
            <div align="center">
                <form onSubmit={this.handleSubmit}>
                    <h1>Hello to your favourite AutoScorer!</h1>
                    <b> Demo Register </b>
                    <br/>
                    <input placeholder='Your name' name='username' type="text"
                                value={this.state.username}  onChange={this.handleChange}/>
                    <br/>
                    <input placeholder='Your password' name='password' type="password"
                                value={this.state.password}  onChange={this.handleChange}/>
                    <br/>
                    <input placeholder='Confirm your password' name='confirm_password' type="password"
                                value={this.state.confirm_password}  onChange={this.handleChange}/>
                    <br/>
                    <input type="submit" value="Register" />
                    <br/>
                </form>
                <br/>
            </div>
        )
    }
}
export default withRouter(Register);