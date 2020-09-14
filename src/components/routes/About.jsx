import React from "react";

const About = () => {
  document.title = "ERD Maker - About";
  return (
    <div className="about">
      <div className="container">
        <h2>About this App</h2>
        <p className="about-text">
          {text}
        </p>
        <h3>Credits</h3>
        <a
          href="https://www.freepik.com/free-photos-vectors/technology"
          title="Background Image"
          target="_blank"
          rel="noopener noreferrer"
        >
          Technology vector created by Harryarts - www.freepik.com
        </a>
        <div>
          Icons made by{" "}
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik" target="_blank" rel="noopener noreferrer">
            Freepik
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon" target="_blank" rel="noopener noreferrer">
            www.flaticon.com
          </a>
        </div>
      </div>
    </div>
  );
};

const text =
  "ERD Maker was developed as a thesis project in the Department of Electrical and Computer Engineering, University of Patras.";

export default About;
