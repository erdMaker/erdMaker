import React from "react";
import { Link } from "react-router-dom";

const Footer = (props) => {
  // External links are rendered as <a> and internal as <Link>
  let linksMarkup = props.links.map((link, index) => {
    let linkMarkup =
      link.type === "int" ? (
        <Link className="nav__link" to={link.link}>
          {link.label}
        </Link>
      ) : (
        <a className="nav__link" href={link.link} target="_blank" rel="noopener noreferrer">
          {link.label}
        </a>
      );
    return <li key={index}>{linkMarkup}</li>;
  });

  return (
    <nav className="footer-nav">
      <ul className="footer-nav__list">{linksMarkup}</ul>
    </nav>
  );
};

export default Footer;
