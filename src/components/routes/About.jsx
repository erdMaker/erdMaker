import { diagramLimit } from "../../global/constants";

const About = () => {
  document.title = "ERD Maker - About";
  const erdLink = (
    <a
      className="default-custom-link"
      href="https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model"
      target="_blank"
      rel="noopener noreferrer"
    >
      Entity - Relationship Diagrams
    </a>
  );
  const reactLink = (
    <a className="react-custom-link" href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">
      ReactJS
    </a>
  );
  const reduxLink = (
    <a className="redux-custom-link" href="https://react-redux.js.org/" target="_blank" rel="noopener noreferrer">
      Redux
    </a>
  );
  const nodeLink = (
    <a className="node-custom-link" href="https://nodejs.org/en/" target="_blank" rel="noopener noreferrer">
      NodeJS
    </a>
  );
  const konvaLink = (
    <a
      className="default-custom-link"
      href="https://konvajs.org/docs/react/index.html"
      target="_blank"
      rel="noopener noreferrer"
    >
      Konva
    </a>
  );
  const issuesLink = (
    <a
      className="default-custom-link"
      href="https://github.com/erdMaker/erdMaker/issues"
      target="_blank"
      rel="noopener noreferrer"
    >
      Issues
    </a>
  );
  const paragraph1 = (
    <p className="about-text">
      ERD Maker is a free and open-source web application used to design {erdLink} (ERD), including the Extended model
      (EER). No account creation is required to start designing but, by registering an account, users can take advantage
      of the cloud-save feature, allowing them to save up to {diagramLimit} diagrams on the cloud and work across many
      devices.
    </p>
  );
  const paragraph2 = (
    <p className="about-text">
      This app was developed as an open-source thesis project in the Department of Electrical and Computer Engineering,
      University of Patras, with the purpose of learning and sharing the knowledge required to build a modern web
      application. Therefore, there is no profit made and any user data collected are used, solely, for the enhancement
      of the user experience. It is built on {reactLink} and {reduxLink}, with a {nodeLink} back-end, and uses{" "}
      {konvaLink} to draw the diagrams.
    </p>
  );
  const contact = (
    <p className="about-text">
      If you are facing any issue, would like to submit a bug report or provide feedback, you can do so in the{" "}
      {issuesLink} section of the Github page. For additional support, you can reach us via e-mail at{" "}
      <span style={{ fontWeight: "bold" }}>erdmakerapp@gmail.com</span>. For account-related issues, please use your
      registered account's e-mail address.
    </p>
  );
  const disclaimer = (
    <p className="about-text">
      <b>
        THIS APPLICATION IS A HOBBY PROJECT AND IS MAINTAINED AS SUCH. AS THERE IS NO REAL FUNDING, ITS RELIABILITY IS
        LIMITED. ANY ACCOUNTS OR DATA STORED CAN BE LOST AT ANY TIME AND WITHOUT PRIOR NOTICE. IT IS RECOMMENDED THAT
        YOU DO NOT MAKE PROFESSIONAL USE OF THIS SERVICE. BY USING THIS APPLICATION YOU FULLY ACKNOWLEDGE THAT WE ARE
        NOT TO BE HELD RESPONSIBLE FOR ANY DAMAGES CAUSED BY THE USE OF THIS TOOL, WHETHER DIRECT, INCIDENTAL, INDIRECT
        OR ANY DATA LOSS OR LEAK.
      </b>
    </p>
  );
  return (
    <div className="about">
      <div className="container">
        <h2>About ERD Maker</h2>
        <p>Version: {process.env.REACT_APP_VERSION}</p>
        {paragraph1}
        {paragraph2}
        <br />
        <h3>Contact</h3>
        {contact}
        <br />
        <h3>***</h3>
        <h3>LIABILITY DISCLAIMER (06/07/21)</h3>
        {disclaimer}
        <h3>***</h3>
        <br />
        <h3>Credits</h3>
        <a
          className="default-custom-link"
          href="https://www.freepik.com/free-photos-vectors/technology"
          title="Background Image"
          target="_blank"
          rel="noopener noreferrer"
        >
          Technology vector created by Harryarts - www.freepik.com
        </a>
        <div>
          Icons made by{" "}
          <a
            className="default-custom-link"
            href="https://www.flaticon.com/authors/freepik"
            title="Freepik"
            target="_blank"
            rel="noopener noreferrer"
          >
            Freepik
          </a>{" "}
          from{" "}
          <a
            className="default-custom-link"
            href="https://www.flaticon.com/"
            title="Flaticon"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.flaticon.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
