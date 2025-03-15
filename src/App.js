import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import { Provider } from "react-redux";
import { store } from "./store";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Home from "./views/Home";
import AssignJudge from "./views/AssignJudge";
import JudgesList from "./views/JudgesList";
import CasesList from "./views/CasesList";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Provider store={store}>
      <Router history={history}>
        <div id="app" className="d-flex flex-column h-100">
          <NavBar />
          <Container className="flex-grow-1 mt-5">
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/judges" component={JudgesList} />
              <Route path="/cases" component={CasesList} />
              <Route path="/assign" component={AssignJudge} />
              
            </Switch>
          </Container>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
