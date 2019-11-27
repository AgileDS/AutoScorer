import React from 'react';
import {Link, withRouter} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {loginReq} from "../api";
import Jumbotron from "react-bootstrap/Jumbotron";
import Alert from "react-bootstrap/Alert";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            update_string: 'just to annoy you',
            server_error: ''
        };
    }

    handleChange = (event) => {
        switch (event.target.name) {
            case "username":
                this.setState({update_string: "Welcome back " + event.target.value});
                break;
            case "password":
                // this.setState({update_string:   "HAHA I know your password " + this.state.username
                //                                 + "!! its " + event.target.value})
                break;
            default:
                break;
        }
        this.setState({[event.target.name]: event.target.value});
    };

    handleSubmit = (event) => {
        event.preventDefault();
        console.log('A name was submitted: ' + this.state.username);
        let payload = {
            "username": this.state.username,
            "password": this.state.password
        }
        loginReq(payload).then(response => {
            console.log("LoginPage", response)
            if (response === false) {
                this.setState({server_error: "Username or password is incorrect"});
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
                    <p> Sign in to get into your dashboard </p>
                </Jumbotron>
                <Form onSubmit={this.handleSubmit} align='left' className="mt-5" style={{'maxWidth': 20 + 'em'}}>
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Enter your username</Form.Label>
                        <Form.Control md="auto" name='username' type="text" value={this.state.username}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control md="auto" name='password' type="password" value={this.state.password}
                                      onChange={this.handleChange}/>
                    </Form.Group>
                    {err_element}

                    <div align="center" className='mt-3 pt-3'>
                        <Button variant="primary" type="submit">
                            Log in
                        </Button>
                        <br/>
                        <Link to='/register'>Don't have an account? Sign Up</Link>
                    </div>
                </Form>
                {/*<p>AutoScorer feedback: {this.state.update_string}</p>*/}
                <br/>
                {/*<Link to="/dashboard">Dashboard</Link>*/}
            </div>
        )
    }
}

export default withRouter(Login);
  