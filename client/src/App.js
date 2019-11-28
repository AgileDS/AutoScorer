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

function App() {
  return (
    <Router basename='/'>
      <div>
        
        <Switch>
          <Route exact path="/">
            <Redirect to="/login"/>
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/register">
              <Register />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
export default App;
