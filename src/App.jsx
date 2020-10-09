import React from "react";
import "./App.scss";
import Home from "./components/routes/Home";
import ResetPassword from "./components/routes/ResetPassword";
import Header from "./components/navbar/Header";
import About from "./components/routes/About";
import Footer from "./components/navbar/Footer";
import Editor from "./components/editor/Editor";
import EmailChangeSuccess from "./components/routes/EmailChangeSuccess";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/designer" exact component={Editor} />
        <Route>
          <div className="main-page">
            <Header />
            <div className="inner-body">
              <Switch>
                <Route path="/resetpassword/*" exact component={ResetPassword} />
                <Route path="/emailchangesuccess" exact component={EmailChangeSuccess} />
                <Route path="/about" exact component={About} />
                <Route path="/" exact component={Home} />
                <Route component={NoMatchPage} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Route>
      </Switch>
    </Router>
  );
};

const NoMatchPage = () => {
  document.title = "404";
  return (
    <div className="general-centered-container">
      <div className="container">
        <h1>404 - Nope, nothing here.</h1>
      </div>
    </div>
  );
};

export default App;

/*
render={(props) => (
  <Home
    {...props}
    toggleForgotPassword={this.toggleForgotPassword}
    toggleOverlay={this.toggleOverlay}
  />
)}
*/

/*
const isCheckbox = event.target.type === "checkbox";
this.setState({
  [event.target.name]: isCheckbox
    ? event.target.checked
    : event.target.value,
});
*/
