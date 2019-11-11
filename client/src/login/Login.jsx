import React from 'react';
import {Link} from "react-router-dom";
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render(){
        return (
            <div>
                <p>
                Login
                </p>
                <Link to="/dashboard">Dashboard</Link>
            </div>
        )
    }
}
export default Login;
  