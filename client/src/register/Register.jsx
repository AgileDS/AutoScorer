import {Link, withRouter} from "react-router-dom";
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


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
                <p className='h1'>Hello to your favourite AutoScorer!</p>
                <b> Demo Register </b>
                <Form onSubmit={this.handleSubmit} className="mt-3"  align='left' style={{'max-width': 20+'em'}}>
                    <br/>
                    <Form.Group controlId="formBasicEmail">
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