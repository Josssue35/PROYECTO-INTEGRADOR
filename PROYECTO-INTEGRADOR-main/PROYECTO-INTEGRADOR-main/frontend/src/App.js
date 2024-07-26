import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Game from './Game';
import Login from './Login';
import Register from './Register';
import Scores from './Scores';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/game" component={Game} />
          <Route path="/register" component={Register} />
          <Route path="/scores" component={Scores} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
