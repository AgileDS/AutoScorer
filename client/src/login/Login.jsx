import React from 'react';
import {Link, withRouter} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
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
                <h1>Hello to your favourite AutoScorer!</h1>
                <b> Demo Login </b>
                <Form onSubmit={this.handleSubmit} align='left' className="mt-5"  style={{'max-width': 20+'em'}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Enter your username</Form.Label>
                        <Form.Control md="auto" name='username' type="text" value={this.state.username}  onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control md="auto" name='password' type="password" value={this.state.password}  onChange={this.handleChange}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Log in
                    </Button>
                    <br/>
                    <Link to='/register'>Don't have an account? Sign Up</Link>
                </Form>
                {/*<p>AutoScorer feedback: {this.state.update_string}</p>*/}
                <br/>
                {/*<Link to="/dashboard">Dashboard</Link>*/}
            </div>
        )
    }
}
export default withRouter(Login);
  