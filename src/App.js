import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import { navigationRoutes } from './navigation/routes';
import MainNavigation from './navigation/MainNavigation';
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';

function App() {

  let routes;
  routes = (
    <Switch>
      <Route exact path={navigationRoutes.HOME}>
        <HomeScreen />
      </Route>
      <Route exact path={navigationRoutes.AUTH}>
        <AuthScreen />
      </Route>
      <Route exact path={navigationRoutes.EVENTS}>

      </Route>
      <Route exact path={navigationRoutes.PROJECTS}>

      </Route>
      <Route exact path={navigationRoutes.ACHIEVEMENTS}>

      </Route>
      <Route exact path={navigationRoutes.ALUMINI}>

      </Route>
      <Route exact path={navigationRoutes.NOTIFICATIONS}>

      </Route>
      <Route exact path={navigationRoutes.TEAM}>

      </Route>
      <Route exact path={navigationRoutes.INTERVIEW_EXPERIENCES}>

      </Route>
      <Route exact path={navigationRoutes.GALLERY}>

      </Route>
      <Redirect to={navigationRoutes.HOME} />
    </Switch>
  );
  return (
    <div className="App">
      <Router>
        <MainNavigation />
        <main>
          {routes}
        </main>
      </Router>
    </div>
  );
}

export default App;
