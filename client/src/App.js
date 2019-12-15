import React from 'react';
import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Login from './login/Login'
import Register from './register/Register'
import Dashboard from './dashboard/Dashboard'
import 'bootstrap/dist/css/bootstrap.min.css';
import UploadForm from './dashboard/UploadForm';

class App extends React.Component {
  state={
    edf:null,
    name:null
  }
  render(){
    return (
      <Router basename='/'>
        <div>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login"/>
            </Route>
            <Route path="/login">
              <Login/>
            </Route>
            <Route path="/dashboard">
              {!this.state.edf ? <UploadForm handleData={(data, filename) => {
                  this.setState({
                      edf:data,
                      name:filename})
                }}/> : null
              }
              <Dashboard edf={this.state.edf} name={this.state.name}/>
            </Route>
            <Route path="/register">
                <Register/>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
export default App;
