import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Layout from './hoc/Layout/Layout';
import Search from './containers/Search/Search';
import Trade from './containers/Trade/Trade';
import './App.css';
import Wallet from './components/Wallet/Wallet';

class App extends Component {
  

  render () {
    return (
      <div className="App">
        <Layout>
          <Switch>
            <Route path="/trade" component={Trade} />
            <Route path="/wallet" component={Wallet} />
            <Route path="/" component={Search} />
          </Switch>
        </Layout>
       
      </div>
    );
  }
}

export default withRouter(App);
