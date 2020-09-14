import React from "react";
import Logo from "../../img/logo.png";
import { Link } from "react-router-dom";

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      headerNavListActive: false,
    };
  }

  render() {
    let linksMarkup = this.props.links.map((link, index) => {
      let linkMarkup =
        link.type === "int" ? (
          <Link
            className="nav__link"
            to={link.link}
            onClick={() =>
              this.setState({
                headerNavListActive: !this.state.headerNavListActive,
              })
            }
          >
            {link.label}
          </Link>
        ) : (
          <a className="nav__link" href={link.link} target="_blank" rel="noopener noreferrer">
            {link.label}
          </a>
        );
      return <li key={index}>{linkMarkup}</li>;
    });

    var headerNavClasses = "header-nav__list";
    var line1Class = "";
    var line2Class = "";
    var line3Class = "";

    if (this.state.headerNavListActive) {
      headerNavClasses += " header-nav__list-active";
      line1Class = "line1";
      line2Class = "line2";
      line3Class = "line3";
    }

    return (
      <nav className="header-nav">
        <Link to="/" onClick={() => this.setState({ headerNavListActive: false })}>
          <img src={Logo} className="logo" alt=":(" />
        </Link>
        <ul className={headerNavClasses}>{linksMarkup}</ul>
        <div
          className="burger"
          onClick={() =>
            this.setState({
              headerNavListActive: !this.state.headerNavListActive,
            })
          }
        >
          <div className={line1Class} />
          <div className={line2Class} />
          <div className={line3Class} />
        </div>
      </nav>
    );
  }
}

export default Header;
