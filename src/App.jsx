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
import { connect } from "react-redux";
import { updateScreenSize } from "./actions/actions";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      headerLinks: [
        { label: "About", link: "/about", type: "int" },
        {
          label: "Github",
          link: "https://www.github.com/raynesz",
          type: "ext",
        },
        {
          label: "Contact",
          link: "/contact",
          type: "int",
        },
        {
          label: "Academic Department",
          link: "http://www.ece.upatras.gr/index.php/el/",
          type: "ext",
        },
      ],
      footerLinks: [
        { label: "Terms", link: "/terms", type: "int" },
        { label: "Privacy", link: "/privacy", type: "int" },
        { label: "Cookies", link: "/cookies", type: "int" },
      ],
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateScreenSize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateScreenSize);
  }

  updateScreenSize = () => {
    this.props.updateScreenSize();
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/designer" exact component={Editor} />
          <Route>
            <div className="main-page">
              <Header links={this.state.headerLinks} />
              <div className="inner-body">
                <Switch>
                  <Route path="/resetpassword/*" exact component={ResetPassword} />
                  <Route path="/emailchangesuccess" exact component={EmailChangeSuccess} />
                  <Route path="/about" exact component={About} />
                  <Route path="/" exact component={Home} />
                  <Route component={NoMatchPage} />
                </Switch>
              </div>
              <Footer links={this.state.footerLinks} />
            </div>
          </Route>
        </Switch>
      </Router>
    );
  }
}

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

const mapDispatchToProps = {
  updateScreenSize,
};

export default connect(null, mapDispatchToProps)(App);

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
