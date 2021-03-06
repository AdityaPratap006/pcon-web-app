import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Redirect, Switch, useHistory } from 'react-router-dom';

import { firebaseAuth, createUserProfileDocument } from './firebase/firebase.utils';
import { AuthContext } from './contexts';
import { navigationRoutes } from './navigation/routes';
import MainNavigation from './navigation/MainNavigation';
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import SplashScreen from './screens/SplashScreen';
import ProfileScreen from './screens/ProfileScreen';
import InterviewsScreen from './screens/InterviewsScreen';
import CreateInterviewScreen from './screens/CreateInterviewScreen';
import ErrorModal from './components/ErrorModal';
import InterviewDetailScreen from './screens/InterviewDetailScreen';
import AlumniScreen from './screens/AlumniScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import EventsScreen from './screens/EventsScreen';
import TeamScreen from './screens/TeamScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import EditInterviewScreen from './screens/EditInterviewScreen';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuthState, setCheckingAuthState] = useState(true);
  const [error, setError] = useState('');
  const browserHistory = useHistory();


  useEffect(() => {
    let unsubscribeUserListener;
    const unsubscribeAuth = firebaseAuth.onAuthStateChanged(async userData => {
      if (userData) {
        const additionalData = {
          registrationNum: '',
          branch: '',
          verified: false,
          appliedForVerification: false,
        };
        const userRef = await createUserProfileDocument(userData, additionalData);

        unsubscribeUserListener = userRef.onSnapshot(snapshot => {
          setCurrentUser({
            id: snapshot.id,
            ...snapshot.data(),
          });
          setCheckingAuthState(false);
        });
      } else {
        setCurrentUser(null);
        setCheckingAuthState(false);
        if (typeof unsubscribeUserListener === 'function') {
          unsubscribeUserListener();
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (typeof unsubscribeUserListener === 'function') {
        unsubscribeUserListener();
      }
    };
  }, []);

  useEffect(() => {
    browserHistory.listen((location, action) => {
      window.scrollTo(0, 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checkingAuthState) {
    return (
      <SplashScreen />
    );
  }

  const commonRoutes = [
    <Route key={1} exact path={navigationRoutes.HOME}>
      <HomeScreen />
    </Route>,
    <Route key={2} exact path={navigationRoutes.EVENTS}>
      <EventsScreen />
    </Route>,
    <Route key={3} exact path={navigationRoutes.PROJECTS}>
      <ProjectsScreen />
    </Route>,
    <Route key={4} exact path={navigationRoutes.ACHIEVEMENTS}>
      <AchievementsScreen />
    </Route>,
    <Route key={5} exact path={navigationRoutes.ALUMNI}>
      <AlumniScreen />
    </Route>,
    <Route key={6} exact path={navigationRoutes.NOTIFICATIONS}>
      <NotificationsScreen />
    </Route>,
    <Route key={7} exact path={navigationRoutes.TEAM}>
      <TeamScreen />
    </Route>,
    <Route key={8} exact path={navigationRoutes.INTERVIEW_EXPERIENCES}>
      <InterviewsScreen />
    </Route>,
    <Route key={9} exact path={`${navigationRoutes.INTERVIEW_EXPERIENCES}/:interviewId`}>
      <InterviewDetailScreen />
    </Route>,
    <Route key={10} exact path={navigationRoutes.GALLERY}>

    </Route>,
  ];


  let routes;
  if (currentUser) {
    routes = (
      <Switch>
        <Route exact path={navigationRoutes.PROFILE}>
          <ProfileScreen />
        </Route>
        <Route exact path={navigationRoutes.CREATE_INTERVIEW_EXPERIENCES}>
          <CreateInterviewScreen />
        </Route>
        <Route exact path={`${navigationRoutes.EDIT_INTERVIEW}/:interviewId`}>
          <EditInterviewScreen />
        </Route>
        {commonRoutes.map(route => route)}
        <Redirect to={navigationRoutes.HOME} />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path={navigationRoutes.CREATE_INTERVIEW_EXPERIENCES} render={() => {
          return <Redirect to={navigationRoutes.AUTH} />
        }} />
        <Route exact path={navigationRoutes.AUTH}>
          <AuthScreen />
        </Route>
        {commonRoutes.map(route => route)}
        <Redirect to={navigationRoutes.AUTH} />
      </Switch>
    );
  }

  const clearErrorHandler = () => {
    setError('');
  }

  return (
    <React.Fragment>
      <ErrorModal
        error={error}
        onClear={clearErrorHandler}
      />
      <div className="App">
        <AuthContext.Provider
          value={{
            user: currentUser
          }}
        >
          <MainNavigation />
          <main>
            {routes}
          </main>
        </AuthContext.Provider>
      </div>
    </React.Fragment>
  );
}

export default App;