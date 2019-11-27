import {withRouter} from "react-router-dom";
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {registerReq} from "../api";
import Jumbotron from "react-bootstrap/Jumbotron";
import Alert from "react-bootstrap/Alert";

const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
        // if we have an error string set valid to false
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            confirm_password: '',
            errors: {
                start: 'error',
                username: '',
                password: '',
                confirm_password: ''
            },
            server_error: ''
        };
    }

    handleChange = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        let errors = this.state.errors;

        switch (name) {
            case 'username':
                errors.username = value.length < 4
                    ? 'Username must be at least 4 characters long' : '';
                errors.start = '';
                break;
            case 'password':
                errors.password = value.length < 4
                    ? 'Password must be at least 4 characters long'
                    : '';
                break;
            case 'confirm_password':
                errors.confirm_password = (value !== this.state.password)
                    ? 'Password inputs must match'
                    : '';
                break;
            default:
                break;
        }
        this.setState({[event.target.name]: event.target.value, errors});
    };


    handleSubmit = (event) => {
        event.preventDefault();
        if (!validateForm(this.state.errors)) {
            console.log("Submit not valid!")
            this.setState({server_error: "Please fill the form correctly"});
            return;
        }
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
            } else if (typeof  response === "string") {
                this.setState({server_error: response});
            } else {
                this.props.history.push('/dashboard');
            }
        });
    };

    render() {
        let err_element;
        if (this.state.server_error) {
            err_element = <Alert variant="danger"> {this.state.server_error} </Alert>;
        }
        return (
            <div align="center">
                <Jumbotron>
                    <h1>Hello to your favourite AutoScorer!</h1>
                    <p> Register to get into your dashboard </p>
                </Jumbotron>
                <Form onSubmit={this.handleSubmit} className="mt-3" align='left' style={{'maxWidth': 20 + 'em'}}>
                    <br/>
                    <Form.Group controlId="formRegisterUsername">
                        <Form.Label>Enter your username</Form.Label>
                        <Form.Control name='username' type="text"
                                      value={this.state.username} onChange={this.handleChange}/>
                        <p className="font-weight-light"> {this.state.errors.username} </p>
                    </Form.Group>
                    <Form.Group controlId="formRegisterPassword">
                        <Form.Label>Your password</Form.Label>
                        <Form.Control name='password' type="password"
                                      value={this.state.password} onChange={this.handleChange}/>
                        <p className="font-weight-light"> {this.state.errors.password} </p>

                        <Form.Label>Confirm your password</Form.Label>
                        <Form.Control name='confirm_password' type="password"
                                      value={this.state.confirm_password} onChange={this.handleChange}/>
                        <p className="font-weight-light"> {this.state.errors.confirm_password} </p>
                    </Form.Group>

                    {err_element}

                    <div align="center" className='mt-3 pt-3 btn-block'>

                        <Button className='col-md-8' variant="primary" type="submit">
                            Register
                        </Button>
                        <Button className='col-md-4 text-right' align="right" variant="link" href="/">
                            Log in
                        </Button>
                    </div>
                    <br/>
                </Form>
                <br/>
            </div>
        )
    }
}

export default withRouter(Register);