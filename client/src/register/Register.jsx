import {withRouter} from "react-router-dom";
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {registerReq} from "../api";


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
        event.preventDefault();
        console.log('A name was submitted: ' + this.state.username);
        let payload = {
            "username": this.state.username,
            "password": this.state.password,
            "confirm_password": this.state.confirm_password
        }
        registerReq(payload).then(response => {
            console.log("RegisterPage", response)
            if (response === false) {
                this.setState({update_string: "There was error with your registration"});
            } else {
                this.props.history.push('/dashboard');
            }
        });
    };

    render(){
        return (
            <div align="center">
                <p className='h1'>Hello to your favourite AutoScorer!</p>
                <b> Demo Register </b>
                <Form onSubmit={this.handleSubmit} className="mt-3"  align='left' style={{'maxWidth': 20+'em'}}>
                    <br/>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Enter your username</Form.Label>
                        <Form.Control name='username' type="text"
                                    value={this.state.username}  onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Your password</Form.Label>
                        <Form.Control name='password' type="password"
                                    value={this.state.password}  onChange={this.handleChange}/>

                        <Form.Label>Confirm your password</Form.Label>
                        <Form.Control name='confirm_password' type="password"
                                    value={this.state.confirm_password}  onChange={this.handleChange}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Register
                    </Button>
                    <br/>
                </Form>
                <br/>
            </div>
        )
    }
}
export default withRouter(Register);