import React, { useState } from "react";
import Logo from "../../img/logo.png";
import { Link } from "react-router-dom";

const Header = () => {
  const [headerNavListActive, setHeaderNavListActive] = useState(false);
  const headerLinks = [
    { label: "About", link: "/about", type: "int" },
    {
      label: "Github",
      link: "https://github.com/Raynesz/erdMaker",
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
  ];
  
  // External links are rendered as <a> and internal as <Link>
  let linksMarkup = headerLinks.map((link, index) => {
    let linkMarkup =
      link.type === "int" ? (
        <Link
          className="nav__link"
          to={link.link}
          onClick={() =>
            setHeaderNavListActive(!headerNavListActive)
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

  // CSS classes are set for the burger menu (whether its displayed or not)
  var headerNavClasses = "header-nav__list";
  var line1Class = "";
  var line2Class = "";
  var line3Class = "";

  if (headerNavListActive) {
    headerNavClasses += " header-nav__list-active";
    line1Class = "line1";
    line2Class = "line2";
    line3Class = "line3";
  }

  return (
    <nav className="header-nav">
      <Link to="/" onClick={() => setHeaderNavListActive(false)}>
        <img src={Logo} className="logo" alt=":(" />
      </Link>
      <ul className={headerNavClasses}>{linksMarkup}</ul>
      <div
        className="burger"
        onClick={() => setHeaderNavListActive(!headerNavListActive)}
      >
        <div className={line1Class} />
        <div className={line2Class} />
        <div className={line3Class} />
      </div>
    </nav>
  );
};

export default Header;
