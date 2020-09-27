import React from "react";

const About = () => {
  document.title = "ERD Maker - About";
  return (
    <div className="about">
      <div className="container">
        <h2>About this App</h2>
        <p className="about-text">{text}</p>
        <p className="about-text">
          <b>
            **DISCLAIMER: THIS APP IS STILL UNDER DEVELOPMENT AND IS NOT PRODUCTION READY. THIS WEBSITE IS USED FOR
            TESTING AND ANY ACCOUNTS OR DATA STORED CAN BE LOST AT ANY TIME AND WITHOUT PRIOR NOTICE. AVOID SUBMITTING
            YOUR REAL PERSONAL INFORMATION.**
          </b>
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
